---
layout: post
title: RabbitMQ - Validating User IDs with Erlang Pattern Matching
category: "rabbitmq-internals"
---

# {{page.title}} #

<span class="meta">September 01 2013</span>

In the [previous blog post](http://videlalvaro.github.io/2013/08/erlang-pattern-matching-protocols-and-rabbitmq.html) on this series on [RabbitMQ](https://www.rabbitmq.com) internals we saw how Erlang's pattern matching can be used to process protocol calls, in this one we are going to see how RabbitMQ handles the validation of user ids by using pattern matching, one of Erlang most powerful features.

User IDs can be used in AMQP to tell a consumer that a certain message was published by a certain user. To do that we just set the `user_id` property of a message whenever we publish one. Now, I could login as Bob and set the `user_id` property of my messages as `"Alice"`and nobody would suspect I tainted my messages. How could we prevent that?

Enter [validated user ids](http://www.rabbitmq.com/validated-user-id.html). What this feature does is that RabbitMQ will make sure the user id set on the message property field is the same one as the user that's logged-in and publishing messages to RabbitMQ. The way this is implemented uses a feature of Erlang pattern matching that's more similar to Prolog's logical variables than to pattern matching in languages like Haskell, F# or Clojure.

Here's the `check_user_id_header` function that we will be analyzing:

{% highlight erlang %}
...
check_user_id_header(#'P_basic'{user_id = undefined}, _) ->
    ok;
check_user_id_header(#'P_basic'{user_id = Username},
                     #ch{user = #user{username = Username}}) ->
    ok;
check_user_id_header(#'P_basic'{user_id = Claimed},
                     #ch{user = #user{username = Actual,
                                      tags     = Tags}}) ->
    case lists:member(impersonator, Tags) of
        true  -> ok;
        false -> precondition_failed(
                   "user_id property set to '~s' but authenticated user was "
                   "'~s'", [Claimed, Actual])
    end.
...
{% endhighlight %}

The first clause of the function is very simple: if the `user_id` property is undefined, then RabbitMQ returns `ok` since there's no reason to validate it.

{% highlight erlang %}
...
check_user_id_header(#'P_basic'{user_id = undefined}, _) ->
    ok;
...
{% endhighlight %}

On the second case we have this special way that Erlang does pattern matching that's not present in out-of-the-box Haskell for example, that is, using the same variable name on the function header. What's going on here? First what happens is that here `#'P_basic'{user_id = Username}` the variable `Username` is initialized to whatever value was on the `user_id` field of the message properties record. Say for example that `Username` will equal "<<"Bob">>". Then here `#ch{user = #user{username = Username}}` we can see that the function goes into the channel state to extract the username of the user that opened the connection and then matches the value of the `username` filed with the variable `Username` that was set before on the same header. If the values are the same, the function will return `ok`, but if they don't match then this function clause won't be executed. Wait, what?

In Erlang, when you first use a variable, it is said that the variable is "unbound", so in our case when the variable is _equaled_ to the value of the `user_id` property from the `#P_basic` record what happens is that the variable takes the value stored there. Why? Because in Erlang the equals sign `=` is not used for setting variables, but for pattern matching. Every time we use `=` in Erlang what we are doing is pattern matching what's on the _right_ of the equals sign with what's on the left. If the values don't match, then Erlang will produce an error. In this case since the variable is unbound what happens is that it gets set to whatever was on the `user_id` field. So far so good.

The second time the variable `Username` is used on that function header, it is not unbound anymore, it holds a value in it, so when Erlang extracts the `username` value and pattern-matches it against the `Username` variable then, well, it has to match. If it doesn't match then the function clause is skipped and Erlang moves onto the third header. Here's the code:

{% highlight erlang %}
...
check_user_id_header(#'P_basic'{user_id = Username},
                     #ch{user = #user{username = Username}}) ->
    ok;
...
{% endhighlight %}

For the sake of completeness let's comment the third and final `check_user_id_header` clause. In this case RabbitMQ takes into account the `impersonator` tag. This tag can be set on a particular user to allow him to publish messages on behalf of others. Here the `user_id` is kept in the `Claimed` variable and the `username` is set in the `Actual` variable. In this case `Claimed` will never be the same as `Actual`, because if they were, then the previous function header would have matched. Here's the code:

{% highlight erlang %}
...
check_user_id_header(#'P_basic'{user_id = Claimed},
                     #ch{user = #user{username = Actual,
                                      tags     = Tags}}) ->
    case lists:member(impersonator, Tags) of
        true  -> ok;
        false -> precondition_failed(
                   "user_id property set to '~s' but authenticated user was "
                   "'~s'", [Claimed, Actual])
    end.
...
{% endhighlight %}

We can argue that this is rather simple code, and for me it's the simplicity of this use case that makes Erlang so great. When I see that second function header I can easily notice that the `user_id` passed when publishing the message has to match the one set channel state `username` field. As simple as that.

In case you are interested in reading more, here's the code from where these examples were extracted: [rabbit_channel.erl](http://hg.rabbitmq.com/rabbitmq-server/file/fe3f446ab083/src/rabbit_channel.erl#l491)

{% include rabbitmq_internals.html %}