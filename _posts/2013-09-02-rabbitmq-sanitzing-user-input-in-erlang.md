---
layout: post
title: RabbitMQ - Sanitizing user input in Erlang
category: "rabbitmq-internals"
---

# {{page.title}} #

<span class="meta">September 02 2013</span>

This post present a rather basic technique for user input sanitization but useful nonetheless. Let's first introduce the problem at hand.

[RabbitMQ](http://www.rabbitmq.com/) supports various types of routing algorithms that are implemented in the form of exchanges. Therefore each exchange has its own _type_. Exchange types are declared as Erlang binaries, like `<<"direct">>` or `<<"fanout">>` for example. That means during the process of booting up the broker, all the supported exchange types are defined, _direct_ in this case, and an Erlang module is registered for each particular exchange implementation. Then when a user wants to create an exchange to use in his/her application, it has to provide a type, say, `"direct"`. RabbitMQ then needs to pick up the right exchange module based on the user input, and as we know, we should never trust user provided input. What happens if the user would try to forge that value into something malicious? 

There are at least two problems with mapping user provided input to Erlang module names: 1) the user might try to load a different module. 2) Erlang module names are just Erlang _atoms_ and the amount of atoms is limited on an Erlang system. If the system runs out of atoms, it will crash (note that the default limit is 2^20, so it's more than enough).

The first problem has two sides. First if someone has already been able to upload arbitrary code into our Erlang node and is trying to execute it, then we have a much more serious problem that goes beyond RabbitMQ security (or any other Erlang application for that matter). Supposing that hasn't happened, on the next blog post we are going to see what RabbitMQ does to ensure that the module called is actually an implementation of an exchange type and not say: `dump_every_user_credential.erl`.

For the second problem, this is what RabbitMQ does: whenever we declare an exchange, RabbitMQ will call `rabbit_exchange:check_type/1` passing the binary provided over the wire with the exchange type, say <<"direct">>, or <<"fanout">>. RabbitMQ does that because it won't declare an exchange for which there's no implementation, (keep in mind user can add new exchange algorithms via [plugins](http://www.rabbitmq.com/plugins.html)). To assert that the exchange type does exist, RabbitMQ keeps a registry mapping _types_ to _Erlang modules_. For example the _direct_ exchange logic is implemented inside the `rabbit_exchange_type_direct` module. To find the actual module, RabbitMQ has to transform the binary that it has received over the wire into an atom, and here's where the problem starts.

To sanitize or validate the input `rabbit_exchange:check_type/1` calls `rabbit_registry:binary_to_type/1` which has a very simple implementation, but one that is very good to know, at least for Erlang beginners who might not know the dangers of running out of atoms –this sound like the perfect plot from some cheap sci-fi book–. Here's the code:

{% highlight erlang %}
...
binary_to_type(TypeBin) when is_binary(TypeBin) ->
    case catch list_to_existing_atom(binary_to_list(TypeBin)) of
        {'EXIT', {badarg, _}} -> {error, not_found};
        TypeAtom              -> TypeAtom
    end.
...
{% endhighlight %}

What this code does is very simple to understand, first it converts the supplied binary to a list, and then uses Erlang's `list_to_existing_atom` to prevent the user from creating new atoms and potentially crashing the system. The error handling logic there is present just in case the supplied binary doesn't translate into an existing atom. The remaining question now is, where does RabbitMQ creates those exchange type atoms?

When an exchange type implementation is created, for example in the module `rabbit_exchange_type_direct`, the exchange type has to be registered, During that process, the binary type is converted into an atom using the previous process in reverse, like this:

{% highlight erlang %}
...
internal_binary_to_type(TypeBin) when is_binary(TypeBin) ->
    list_to_atom(binary_to_list(TypeBin)).
...
{% endhighlight %}

With this simple technique RabbitMQ can translate back and forth from user supplied input into the exchange types that it supports. Note that this is used in several more places in the RabbitMQ source code, for example, RabbitMQ supports plugable authentication backends, where again it has to map from user provided binaries into implementation modules. The same happens when it needs to detect the type of [mirroring mode](http://www.rabbitmq.com/ha.html#genesis) chosen for a HA queue.

In the next blog post we are going to explore how RabbitMQ ensures that a new exchange type provided by a plugin is in fact an implementation of the `rabbit_exchange_type` behaviour, or that an authentication mechanism exposed by a plugin is an implementation of `rabbit_auth_mechanism`.

To see the full source code go here:

- `rabbit_registry:binary_to_type/1` [source code](http://hg.rabbitmq.com/rabbitmq-server/file/fe3f446ab083/src/rabbit_registry.erl#l62).
- `rabbit_registry:internal_binary_to_type/1` [source code](http://hg.rabbitmq.com/rabbitmq-server/file/fe3f446ab083/src/rabbit_registry.erl#l81).

{% include rabbitmq_internals.html %}