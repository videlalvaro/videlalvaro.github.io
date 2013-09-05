---
layout: post
title: RabbitMQ Internals - Validating Erlang Behaviours
category: "rabbitmq-internals"
---

# {{page.title}} #

<span class="meta">September 04 2013</span>

RabbitMQ implements several routing algorithms in the form of exchanges, therefore we say that each exchange has a _type_. By default RabbitMQ comes with four exchange types: _direct_, _fanout_, _topic_ and _headers_ and allows the user to add new exchange types via plugins. For example there's the `[rabbitmq-consistent-hash-exchange](http://hg.rabbitmq.com/rabbitmq-consistent-hash-exchange/file/rabbitmq_v3_1_5/README.md)` which adds consistent hash routing to RabbitMQ. 

Now, how does RabbitMQ makes sure that an user provided exchange type is in fact an implementation of the `rabbit_exchange_type` behaviour? It doesn't make sense for RabbitMQ to register a new exchange type that's unable to `route/2` messages.

The process of checking that a certain exchange implements the `rabbit_exchange_type` behaviour starts when the exchange type is registered. RabbitMQ keeps a registry of exchange types by using the `rabbit_registry` module. When a new exchange type is defined, it is registered like this:

{% highlight erlang %}
rabbit_registry:register([exchange, <<"direct">>, rabbit_exchange_type_direct]).
{% endhighlight %}

What that code does is to register an `exchange` of the type `<<"direct">>`, which is implemented by the `rabbit_exchange_type_direct` module.

The first part of the puzzle is a map of classes to behaviours that's part of RabbitMQ's source code. If you are confused at this point, don't worry, I am as well.

RabbitMQ has an architecture that supports plugins that could modify the broker behaviour in several places. Adding new exchange types is one of those places, but there are more, like for example adding new authentication mechanisms. Each of those concepts –exchanges and authentication mechanisms– have their own class. In the following code:

{% highlight erlang %}
...
class_module(exchange)           -> rabbit_exchange_type;
class_module(auth_mechanism)     -> rabbit_auth_mechanism;
{% endhighlight %}

there's a map definition that says the class `exchange` is implemented via the `rabbit_exchange_type` behaviour and the `auth_mechanism` class is implemented via the `rabbit_auth_mechanism` behaviour.

When we call `rabbit_registry:register` RabbitMQ will sanity check the parameters we passed to see if our new exchange module actually implements the `rabbit_exchange_type` behaviour. That task is taken care by the function `rabbit_registry:sanity_check_module/2`:

{% highlight erlang %}
...
sanity_check_module(ClassModule, Module) ->
    case catch lists:member(ClassModule,
                            lists:flatten(
                              [Bs || {Attr, Bs} <-
                                         Module:module_info(attributes),
                                     Attr =:= behavior orelse
                                         Attr =:= behaviour])) of
        {'EXIT', {undef, _}}  -> {error, not_module};
        false                 -> {error, {not_type, ClassModule}};
        true                  -> ok
    end.
    ...
{% endhighlight %}

This function grabs the attributes of our module by calling `Module:module_info(attributes)` and then inspects their declared behaviours to see if they implement the required one for the `exchange` class, in this case `rabbit_exchange_type`. Note also the error handling here. RabbitMQ takes into account the fact that we could provide a non existing module.

The takeaway here is that if you are going to allow your users to extend your Erlang application, first your application needs to expose behaviours that have to be implemented by the user. From there, we can resort to inspecting the attributes of the module provided by the user to see if the expected behaviours are present. While this technique might seem rather simple, it's good to remember that we can add our own attributes to our Erlang modules and then later retrieve them to do interesting things with them, see the `[rabbit_boot](https://github.com/videlalvaro/rabbit-internals/blob/master/rabbit_boot_process.md)` system for an advanced example of this technique.

To see the full source code go here:

- `rabbit_registry:sanity_check_module/2` [source code](http://hg.rabbitmq.com/rabbitmq-server/file/dd70b629351f/src/rabbit_registry.erl#l117)