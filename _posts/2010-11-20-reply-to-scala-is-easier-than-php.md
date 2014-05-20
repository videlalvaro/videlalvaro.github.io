---
layout: post
title: Reply to "Scala is Easier than PHP"
---

# {{page.title}} #

<span class="meta">November 20 2010</span>

This week I came across the blog post by Wade Arnold [Scala is Easier than PHP](http://wadearnold.com/blog/scala/scala-is-easier-than-php) and while I agree with most of it, there are some things where I don't. Before going on with the points, let me state something: please avoid flame wars, all the Scala vs. PHP stuff, fanboyism and what not. This post is not about that. Regarding Wade Arnold I have to say that I fully respect him. While I don't know him personally, I know him for his work on AMFPHP, since it was a platform I used to work with before. So, all things considered lets begin…

In his blog he explains some of the advantages of using a functional programming language like Scala over PHP. At some point he writes:

> As we continue to add more screens, more protocols, and more data aggregation services, and frankly more data we need to be able use all cores in the server and the cluster. As Guy Steele implied at Strange Loop. The single processor programming model is going the way of the punch card.

What I understand from that paragraph is that if we want to do multicore programming, then we have to use something else, not PHP, to get the full advantage of today's CPUs. He then goes an suggests Scala as the solution. I've done something similar in the past, suggesting Erlang as the super cool functional programming language that will relieve all your multicore programming pains. Back in June this year I realized how wrong I was.

I was at the IPC Spring Edition conference in Berlin presenting my talk "Integrating Erlang with PHP". I started by talking about all the wonders that Erlang promises such as:

- Code reload without stoping the server.
- Being ready for multicore programming.
- No shared state.

When the audience looked at me like: "hey PHP already does that", I realized how much Kool Aid I had drunk. Every PHP developer knows that to see the changes in your code reflected on the webpage you just have to hit F5 on your browsers and "ta da!". Your new shinny whatever will be there –Well, if you use APC you'll probably have to clear the APC cache, but that's about it–. So "what are you talking about with this 'code reload' thing".

Regarding _running on all the cores_… well, normally you spawn many PHP threads to process the web requests, so you'll take advantage of your server many CPUs. We can scream that PHP is ready for multicore! –put down them torches and	 keep reading please ;)–.

What about _shared state_? When you call a PHP script it will load into memory all the configuration and things that make up the process state –extensions for example–, will process the request and then will cleanup and shutdown. Of course there's shared state in the programming model of PHP, but each PHP script running on the server has no idea that there are many –probably dozens– of other PHP scripts serving requests at the same time.

This seems that we are comparing apples to some weird asian fruit that I don't even know the name but I know that it smells bad… and that raises the question of "ok do I need Scala, Erlang or \[cool FP lang here\]?" I'd venture to say yes, and here I'll negate all what I said before, bear with me.

I talked about code reload without stoping the server kind of worked by default with PHP. The thing is PHP is no server, PHP *is* served :). So your PHP script code *is reloaded* with every execution –unless you use APC– therefore updating the results of its executing right after you modifying the script, so comparing this to Erlang's way is –you guessed right– cheating. Now say you want to do a long running process with PHP and introduce changes latter, then yes, you'll have to restart that script. As you may guess, Erlang has an advantage here. Of course the average PHP user that is using the language for creating web pages won't care.

If you read what I wrote before it looks like I went nuts, that I know nothing about PHP, less about Erlang and Scala, because PHP is not ready for multicore! "Wait a minute, before you said that it was ready". Well the way that most people run PHP, spawning many threads, will use several cores,  but each single PHP script will not. That seems pretty obvious and it is. So if you have a PHP script that gets a message from a queue and then executes a callback on that message, it would be very nice to be able to execute the callback in parallel while you keep getting messages from the queue and calling other callbacks. Sorry amigo, it may sound nice, but you can't do that with PHP's execution model. You could accomplish that in languages like Erlang for example.

Now back to _no shared state_. On the PHP world, this gives you a big advantage. Say some PHP file is faulty, or some database went down, and then you get exceptions thrown all over the place… Well, the users of your website that are accessing other parts of the site that has no DB access will still see what they want. That's pretty similar with Erlang's philosophy when one process dies and then all the others continue working with no problems. The bad thing with PHP is that there's no *easy* way for those processes to talk to each other –of course you can stretch some boundaries and make that communication happen, but by that point you should be using something else–. Erlang on the other side has some pretty impressive interprocess communication ways. In fact all its programming model is based around message passing. Once you got used to it, you'll do many nasty things to get that in your language.

In conclusion if you want to do some long running process, like some kind of server, then of course Scala and Erlang both offer many advantages over PHP, and being able to use all your CPUs is an important one. I believe Wade Arnold blog post was referring to such use cases. But if you just want to generate web pages with PHP, then get some PHP-FPM goodness and you'll get all your CPUs doing the work.

Another interesting point that I made from his blog post and from my mistakes back in the conference is that if we want to _sell_ functional languages like Erlang or Scala to the PHP programmer then we have to look for more compelling features that may attract them to look into these languages. What I think are those features –I guess–, should be part of another blog post.