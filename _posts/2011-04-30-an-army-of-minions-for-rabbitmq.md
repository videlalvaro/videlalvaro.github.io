---
layout: post
title: An Army of Zombie Minions for RabbitMQ
---

# {{page.title}} #

<span class="meta">April 30 2011</span>

Imagine that you spawn a bunch of RabbitMQ consumers and let them in a zombie state waiting for orders to start performing some sort of work, like counting words occurrences in text files. Then from the secret chamber where you orchestrate things you will send a message to all those zombies and the will start working on what you tell them to. The sequence will be something like this:

1) Launch 10 consumers.
2) They do nothing, just wait for orders.
3) Send an AMQP message: "Become a count words server".
4) The 10 consumers will start consuming from a queue that will feed them text via AMQP messages.
5) Send AMQP message: "Become a reverse words server".
6) The 10 consumers will start consuming from a queue that will feed them text to reverse via AMQP messages.
7) Laugh like a mad scientist (rainy night with thunderstorm required).

To achieve such scenario using RabbitMQ we will need the following:

- A topic exchange called _control_.
- A routing key to identify a group of consumers/zombies.
- An exchange where we can send the _word count_ or _word reverse_  messages.

We will be using the [rmq_patterns](https://github.com/videlalvaro/rmq_patterns) library for the examples, so you can go and get the code while we continue.

By using that library we can fire up the Erlang REPL and start getting the `exchanges` we need declared on the server:

{% highlight erlang %}
$ cd /path/to/rmq_patterns
$ ./start-dev.sh 1
1> misc:declare_exchanges([{<<"control">>, <<"topic">>, true}, {<<"my_exchange">>, <<"direct">>, true}]).
{% endhighlight %}

There we declare two exchanges, one called _control_ that we will use as part of our [control bus](http://www.eaipatterns.com/ControlBus.html). The other will be used to send messages to our zombies once they are _awake_.

The line that says `./start-dev.sh 1` will just get us an Erlang REPL up and running. The number `1` there as an argument can be anything that can _unique-identify_ our Erlang node in a cluster of Erlang nodes.

The next step is to start our zombie consumer.

{% highlight erlang %}
2> amqp_consumer:start_demo(<<"control">>, <<"word.zombies">>).
{% endhighlight %}

What we do there is to start our consumer and tell it that the it will receive orders from the __control__ exchange and it will be addressed as part of the __word.zombies__ group. This all sounds to magical? Ok here's how this work: We will have an exchange called __control__ where we will send our __control__ messages. Messages like "Start consuming from queue xyz using callback zyx", or "Stop consuming messages", and so on. The group identifier for consumers is just an AMQP __routing key__ that we will use to address a group of consumers. So when we start our consumers using routing key like `word.zombies` what we are saying is "this consumer is part of the group _word.zombies_. As a final note `amqp_consumer:start_demo/2` is just a helper function to start the consumer using some defaults. You can peek inside it and adapt it to your own needs, like different connection parameters and so on.

Now that we got our consumer in zombie mode, let's start our __control__ interface in another Terminal window.

{% highlight erlang %}
$ cd /path/to/rmq_patterns
$ ./start-dev.sh 2
1> {ok, Pid} = amqp_control_bus:start_demo().
Server started with Pid: <0.53.0>
{ok,<0.53.0>}
{% endhighlight %}

As we said before, we will use the __contol__ process to send messages to a group of zombies and then make them start working for us. What we want to do is to send messages containing sentences to an exchange called __my_exchange__ and see how many words they had. Something pretty simple for the purposes of this demo. So let's send a message with an English sentence to see how many words it has. Let's do this in the same console where we are running our __control__ process.

{% highlight erlang %}
2> amqp_utils:send_msg(<<"my_exchange">>, <<"I can't explain myself, I'm afraid, Sir, because I'm not myself you see.">>, <<"consumer.key">>).
ok
{% endhighlight %}

Oops! nothing happened... And that's correct, we haven't told our zombies that they have to start listening on exchange __my_exchange__ to start getting messages. So let's get that fixed and raise our army!.

{% highlight erlang %}
3> amqp_control_bus:consumer_msg(Pid, <<"word.zombies">>, {<<"my_exchange">>, <<"consumer.key">>, fun misc:word_count_callback/2}).
ok
{% endhighlight %}

Now let's try to send a message to the zombie consumer again

{% highlight erlang %}
4> amqp_utils:send_msg(<<"my_exchange">>, <<"I can't explain myself, I'm afraid, Sir, because I'm not myself you see.">>, <<"consumer.key">>).
ok
{% endhighlight %}

If everything went well, on the REPL where we were running the Zombie consumer we should see this output: `Count: 13`, that is, the sentence we sent over RabbitMQ had 13 words on it –counting them as separated by single spaces–. Try with different sentences to see what happens.

Let's explain what we just did. First we sent a message to our group of Zombies telling them to start listening to messages published on the __my_exchange__ exchange using the __consumer.key__ routing key (You can specify whatever key you want as long as you publish your messages using that routing key). The last argument element of our tuple is the Erlang callback that we want to be executed by our Zombies. In this case it will be the function `misc:word_count_callback/2`. The first argument that this function takes is a `Channel` connected to RabbitMQ. The second one is the AMQP `Message` that we got from the server.

Now, say we got bored of counting words. Let's reverse them. To do that we will tell our zombies to start using the `misc:word_reverse_callback/2` function. Let's do it. Switch to the window with the control REPL and type:

{% highlight erlang %}
4> amqp_control_bus:consumer_msg(Pid, <<"word.zombies">>, {<<"my_exchange">>, <<"consumer.key">>, fun misc:word_reverse_callback/2}).
ok
{% endhighlight %}

And then let's send a message to see if this worked:

{% highlight erlang %}
5> amqp_utils:send_msg(<<"my_exchange">>, <<"I can't explain myself, I'm afraid, Sir, because I'm not myself you see.">>, <<"consumer.key">>).
ok
{% endhighlight %}

Check the Terminal window running your Zombie consumer, you should see some output like:

{% highlight erlang %}
Reversed Words: ["see.","you","myself","not","I'm","because","Sir,","afraid,",
                 "I'm","myself,","explain","can't","I"]
{% endhighlight %}

Isn't this cool? We just modified the behavior of our consumer without even restarting it!

Imagine modifying the behavior of your RabbitMQ workers on the fly, without ever stopping them? Or sending them configuration messages like: "Hey the MySQL database on server ABC just went down, so you'd better start performing inserts on server CBA" and so on.

I dared to call this technique as __"Control Enabled Messaging Endpoints."__ Normally we create messaging endpoints, AKA consumers/producers, that publish/consume messages sent between them. In this case we augment them by making them listen to the Control Messages that are published on a separate Exchange. If you are interested in messaging, take a look at the [Enterprise Integration Patterns](http://www.eaipatterns.com/) book, which explain these patterns in great detail.