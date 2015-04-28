---
layout: post
title: Folding Erlang Records
---

# {{page.title}} #

![Fold Your Hands Child](/images/2283737150_4b7a1775a9_z.jpg)

<span class="meta">April 27 2015</span>

When developing the new
[RabbitMQ Delayed Exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange)
plugin I had the problem of extracting values from deeply nested
records like the one created for message deliveries in RabbitMQ.

Imagine you have the following record from which you need to access
the `headers` filed of the innermost `#'P_basic'` record.

{% highlight erlang %}
#delivery{message = #basic_message{content = #content{properties = #'P_basic'{headers = H}}}}.
{% endhighlight %}

Of course we could have pattern matching on a function header to
extract the innermost value, like this:

{% highlight erlang %}
headers1(#delivery{message = #basic_message{content = #content{properties = #'P_basic'{headers = H}}}}) ->
    H.
{% endhighlight %}

Besides from the point that doing this kind of destructuring gets a
bit hairy, what would happen if at some point we want to just access
all the content properties? Or just the basic_message?

To solve this I decided to have a function to access each specific
property from each record, ending up with these functions:

{% highlight erlang %}
get_msg(#delivery{message = Msg}) ->
    Msg.

get_content(#basic_message{content = Content}) ->
    Content.

get_props(#content{properties = Props}) ->
    Props.

get_headers(#'P_basic'{headers = H}) ->
    H.
{% endhighlight %}

To use these functions we could call each one in succession and then
return the headers:

{% highlight erlang %}
headers2(Delivery) ->
    Msg = get_msg(Delivery),
    Content = get_content(Msg),
    Props = get_props(Content),
    Headers = get_headers(Props),
    Headers.
{% endhighlight %}

Now in the above situation, what would happen if the field we are
trying to access from the record is `undefined`? One solution would be
to add an extra clause to each of the `get_*` functions where we
handle the undefined case:

{% highlight erlang %}
get_msg(undefined) ->
    undefined;
get_msg(#delivery{message = Msg}) ->
    Msg.

get_content(undefined) ->
    undefined;
get_content(#basic_message{content = Content}) ->
    Content.

get_props(undefined) ->
    undefined;
get_props(#content{properties = Props}) ->
    Props.

get_headers(undefined) ->
    undefined;
get_headers(#'P_basic'{headers = H}) ->
    H.
{% endhighlight %}

While that would work, it seems to me there should be a better
solution. Enter `foldl`.

With lists:foldl/3 we can do the following:

{% highlight erlang %}
headers3(Deliver) ->
    lists:foldl(fun (F, Acc) -> F(Acc) end,
                Delivery,
                [fun get_msg/1, fun get_content/1,
                fun get_props/1, fun get_headers/1]).
{% endhighlight %}

When calling this fold using the current record as the accumulator and
a list of functions as the things to apply on each iteration of the
fold. Each successive call will be able to go deeper in the record
structure until it finds the headers we are looking for.

We still have the problem of what happens when a record property we
try to access returns `undefined`. Thanks to Erlang's pattern matching
on function headers, we can easily address that:

{% highlight erlang %}
headers3(Delivery) ->
    lists:foldl(fun (_, undefined) -> undefined;
                    (F, Acc) -> F(Acc)
                end,
                Delivery,
                [fun get_msg/1, fun get_content/1,
                 fun get_props/1, fun get_headers/1]).
{% endhighlight %}

With this last version of the function, now we can handle the
`undefined` case but we still have the problem that the fold doesn't
short circuit the first time it finds and `undefined` value. Let's add
that:

{% highlight erlang %}
headers4(Delivery) ->
    catch lists:foldl(fun (_, undefined) -> throw(undefined);
                          (F, Acc) -> F(Acc)
                      end,
                      Delivery,
                      [fun get_msg/1, fun get_content/1,
                       fun get_props/1, fun get_headers/1]).
{% endhighlight %}

Here we added a `throw()` to short-circuit the fold and a `catch` to
handle that. In the successful case, catch would return the header we
want to access, for all other cases `undefined` will be returned as
soon as a record field is undefined.

By using fold and a list of funs, we can decide how deep in the
record we want to go just by providing the right list of functions.

I hope this idea of _folding Erlang records_ is useful to you, which
BTW, looks an awful lot like composition in the Maybe Monad.

Here's a gist with the code examples:
[fold_example.erl](https://gist.github.com/videlalvaro/e38b990126b0abdae2d5).

## Credits ##

Photo Credit [Ran Yanviv Hartstein](https://flic.kr/p/4tNKus). License CC BY 2.0.