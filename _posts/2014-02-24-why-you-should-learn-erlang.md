---
layout: post
title: Why you should learn Erlang
---

# {{page.title}} #

<span class="meta">February 24 2014</span>

With all the rage about [WhatsApp acquisition by Facebook](http://www.forbes.com/sites/briansolomon/2014/02/19/stunner-facebook-to-buy-whatsapp-for-16-billion-in-cash-stock/),
people is going crazy over Erlang. Even [recruiters](https://twitter.com/susanpotter/status/437940423776927745) are using it as a weapon to lure
engineers in. So I said, what don't I write that blogpost about why I consider people should learn Erlang?

Keep in mind this is not a blog post about _how to program_ in Erlang, nor is it a fanboy attempt to say Erlang is better than language X. So please refrain from language flamewars.
Also, I don't think I will provide many code examples, since I think they don't matter for this particular kind of discussion.

## The reasons ##

I'm writing this blog post from this question: I might not need to code in Erlang from my day job, still, is there anything I could learn from Erlang that will make me a better programmer?
So without much further ado, here are the reasons why you should learn Erlang:

### Single Assignment Variables ###

The first thing that was remarkable for me from Erlang was that variables don't vary. In Erlang, once you _assign_ a value to a variable, then it can't be changed. If you come from the
imperative programming world (Java, PHP, .Net, Python, etc.), then learning to live with that it's a lot, because in our programs we are making assignments and mutating variables all
the time.

Now, what is so cool about this "feature" of Erlang, that actually prevents you from doing things? Remember that time you had to track the lifecycle of one variable to try to debug why at
in production, when it was 3:03 PM sharp after the 20th request has been served, the variable will become `true` instead of `false`, as it should have been? Did you enjoy wasting time
reproducing that bug to be able to track it down? No? Me neither.

With Erlang it becomes quite easy to avoid such problems because you simply can't change a variable once it's been assigned a value. Little by little your brain starts to learn to live with
that, to see that and algorithms can be implemented without mutable variables, that problems can be solved that way. You start to learn that you actually don't need that many variables, that
less is more.

One you go back to your day to day job, and you start coding in Imperative Language (IL) you will start seeing that perhaps this variable that we change here and there is not actually needed.
That modifying that object at that particular place makes the code hard to reason about. That all the encapsulation that you brag about got completely destroyed when you passed an object to a
method, and the method mutated the object in ways that shouldn't have happened. Well, having some experience with Erlang will train your coder instincts to detect those places where modifying
an object or variable state is dangerous. For me this has been the best thing I've learnt from single assignment variables. Please not that I'm not arguing against those algorithms implemented
in imperative languages that due to performance reason have to be implemented with mutation, I'm just saying that coding in Erlang will let you easily detect those parts of your code that might
present a problem later.

### Pattern Matching ###

Pattern matching is the part of Erlang that sets it apart from most other languages. For example, Erlang doesn't have for loops, but you can implement a similar behaviour like this:

{% highlight erlang %}
do_n(F, N) ->
    do_n(F, 0, N, []).

do_n(_F, N, N, Acc) ->
    Acc;
do_n(F, Count, N, Acc) ->
    do_n(F, Count+1, N, [F(Count)|Acc]).
{% endhighlight sh %}

The first function definition `do_n(F, N)` is just a more usable interface to our `do_n/4` function that takes four arguments. We pass an anonymous function `F` to `do_n` and a number `N`
indicating how many times we want to call that function. Then this function would call `do_n/4` like this for example: `do_n(F, 0, 10, [])`, where it's telling `do_n` to start counting at `0`
and to stop when the counter reaches `10`.

On the second part we have a recursive function with two headers, that is: two function definitions that would be called depending on the value of its arguments. Every time the function is
called, the `Count` variable will be increased, and the second part of the function will be called again. Now, we don't see any `if` statement there checking if the counter ever becomes `10`.

The first header of the function is written like this: `do_n(_F, N, N, Acc)`, that is: only execute this body of the function if the 2nd and the 3rd argument are both the same. So when the
function is called, The first argument will be whatever is passed to it, and the second one will be `10` in our example, so unless the counter becomes `10` at some point, then this body of
the function will never be called.

For me the simplicity of this construct alone is what makes learning to program in Erlang so valuable.
(See more about this feature in real world example from RabbitMQ [here](http://videlalvaro.github.io/2013/09/rabbitmq-validating-user-ids-with-erlang-pattern-matching.html)).

Apart from that, Erlang's pattern matching comes with "destructuring". Another cool feature that will drive you mad next time you need to access a deeply nested data structure in a non Erlang
language. Once you learn to you use it, you will probably open an online petition so your day to day programing language gets this feature soon.

### The Actor Model ###

The whole concept of having millions of tiny processes composing your system, working in harmony to reach a solution, sounds cool enough to start learning Erlang already. This mode of
computation is called the Actor Model, introduced by Carl Hewitt in his famous paper: [A Universal Modular ACTOR Formalism for Artificial Intelligence](http://worrydream.com/refs/Hewitt-ActorModel.pdf).

The concept of processes supervising each others; processes that will automatically shut down if a neighbor process has died; process that are isolated from each other and that can't
corrupt each others states; and more, are quite interesting reasons to dive into Erlang to see what is this all about, and learn that the way we do OOP perhaps should be the way Erlang is
doing it, with completely isolated objects that communicate with each others by means of message passing. Learning the actor model will let you improve the ways you understand OOP.

### The Syntax ###

There's a lot of complaining about Erlang Syntax. Well, yes, if you come from the ALGOL family of languages, then of course it's weird, I grant you that, but if you want to learn something
new, I think Erlang syntax is there to remind you "Hey! I don't think that thing means what you think it means", all the time. For a language that comes with a complete new paradigm like
concurrent programming, I think a rather different syntax is also interesting.

## Books ##

Some resources for Learning Erlang:

I've learnt Erlang from this book: [Programming Erlang: Software for a Concurrent World](http://pragprog.com/book/jaerlang/programming-erlang).

From that book I went directly to this guide from the official docs: [OTP Design Principles](http://www.erlang.org/doc/design_principles/des_princ.html).

I've learnt about Mnesia (the Erlang database) from here: [Mnesia User's Guide](http://www.erlang.org/doc/apps/mnesia/Mnesia_chap1.html).

Then the book [Erlang and OTP in Action](http://www.manning.com/logan/) will teach you a lot about building reliable apps with Erlang.

As a project to learn Erlang, I tried to create a Redis clone in Erlang. I've never published that project, but I've learnt a lot from it.

Finally I've got hooked with RabbitMQ so from time to time I would read the source code just to learn more about Erlang. You can read some of those adventures [here](http://videlalvaro.github.io/internals.html)
and [here](https://github.com/videlalvaro/rabbit-internals), and some slides [here](http://www.slideshare.net/old_sound/dissecting-the-rabbit).

## Conclusion ##

To sum it up, why you should learn Erlang? It will make you more aware of all the places were your code is modifying state, and perhaps there's a cleaner implementation that doesn't need that.
Keep in mind that the more you write _pure functions_, function that always return the same value for the same arguments, the easier it will become to prove that code correct, for example by
writing unit tests for it. Erlang has the notion of pattern matching. This will literally change the way you see code, and will make you wonder why your language of choice doesn't support this feature.
The actor model will give you a new perspective on the words _encapsulation_ and probably make you think that the OOP we've been doing so far has been just putting namespaces around collections
of related functions. Finally the syntax will help you navigate through the moody waters of new concepts, reminding you that what looks like _this_ is actually _that_.

I hope this has been helpful in making you decide why to learn Erlang. Again, I didn't want to write a tutorial about Erlang, but just to highlight some of its salient features that will make
worth your time learning a new language like Erlang. I'm sure new perspectives on programming will benefit our day to day jobs in the long run.
