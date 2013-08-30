---
layout: post
title: Erlang Pattern Matching, Protocols and RabbitMQ
---

# {{page.title}} #

<span class="meta">August 29 2013</span>

Here's a very simple example from [RabbitMQ](https://www.rabbitmq.com)'s source code on how easy it's to implement a protocol calls with Erlang.

While RabbitMQ supports many protocols, internally mostly everything is handled via AMQP. In AMQP there's the concept of a _Channel_, which is just a way to subdivide connections. Most of the commands send to the server, whether to publish or consume messages, or to create queues, are done over the channel. To be able to use a channel, first we have to open one, by calling _[channel.open](https://www.rabbitmq.com/amqp-0-9-1-quickref.html#channel.open)_. Let's see how RabbitMQ handles these calls by taking advantage of Erlang's pattern matching.

{% highlight erlang %}
...
handle_method(#'channel.open'{}, _, State = #ch{state = starting}) ->
    {reply, #'channel.open_ok'{}, State#ch{state = running}};

handle_method(#'channel.open'{}, _, _State) ->
    rabbit_misc:protocol_error(
      command_invalid, "second 'channel.open' seen", []);

handle_method(_Method, _, #ch{state = starting}) ->
    rabbit_misc:protocol_error(channel_error, "expected 'channel.open'", []);
...
{% endhighlight %}


There we have three different headers for the same Erlang function `handle_method/3`, where the actual function body to be executed will depend on the parameters passed to the function. The function `handle_method/3` expects three parameters: the actual AMQP `Method`, its `Content` (for example the published message), and the current channel `State`.

The default `state` of a channel that has been just instantiated is 'starting', so we can see that the first body of the function will be called only on a new channel, and RabbitMQ replies `channel.open_ok` to the client:

{% highlight erlang %}
...
handle_method(#'channel.open'{}, _, State = #ch{state = starting}) ->
    {reply, #'channel.open_ok'{}, State#ch{state = running}};
...
{% endhighlight %}

As you can see from the return of this function, the `state` of the channel is updated to `running`. We can also learn from here that while we have _variables that don't vary_ in Erlang, we can still update the state of our program with ease.

Then the second function header is where Erlang's pattern matching starts to play. If the method called is `channel.open`, but the channel `state` is different from `starting` RabbitMQ can safely return an error to the client: `second 'channel.open' seen`:

{% highlight erlang %}
...
handle_method(#'channel.open'{}, _, _State) ->
    rabbit_misc:protocol_error(
      command_invalid, "second 'channel.open' seen", []);
...
{% endhighlight %}

On the third function header we have that we can receive any method, but the channel has just been created as indicated by the `starting` state. In this case RabbitMQ covers all those cases where the user tried to send a method over the channel _before_ having received the `channel.open_ok`:

{% highlight erlang %}
...
handle_method(_Method, _, #ch{state = starting}) ->
    rabbit_misc:protocol_error(channel_error, "expected 'channel.open'", []);
...
{% endhighlight %}

As you can see on those examples, with a few basic rules expressed via Erlang's powerful pattern matching we can handle all these tiny detail of protocol negotiation. While these examples might seem trivial, I hope to dive deeper into RabbitMQ's source code and present more advanced examples.

In case you are interested in reading more, here's the code from where these examples were extracted: [rabbit_channel.erl](https://github.com/rabbitmq/rabbitmq-server/blob/master/src/rabbit_channel.erl#L593)