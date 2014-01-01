---
layout: post
title: Things I learnt last year
---

# {{page.title}} #

<span class="meta">January 01 2014</span>

In this blog post I've plan to share some of the topics that caught my attention last year, like programming languages I used, algorithms I've learnt during the year, and even books I've read. I'm sharing this with the hope that something might be interesting to you. Let's start with a programming language/tool that was really interesting to play with, Processing.

## Processing ##

[Processing](http://www.processing.org/) is a programming language and set of tools to produce animations and graphics. It started as a language on top of the JVM and today even runs on the browser via [Processing.js](http://processingjs.org/), a port of Processing to Java Script by John Resig (of jQuery fame). What I like about processing is that it uses a syntax similar to Java, so I can invest time learning about animation in this case, and not worrying too much about the language syntax.

I used Processing to create the [RabbitMQ Simulator](http://vimeo.com/56986242) in order to improve the way I was explaining RabbitMQ at my talks. Before having the simulator I used to explain RabbitMQ routing via static images and a bit of hand waving. Today I can just start the simulator and show people how it can get messages from A to B passing through exchanges and queues. Every time I presented AMQP concepts via the Simulator I saw the faces of people in the audience showing the "A Ha!" expression. 

My takeaway from this experience is that images and good visuals triumph over wordy and hand-waving explanations. So whenever I want to explain something technical I think for myself in true internet spirit: "Picture or it didn't happen". Considering the tools we have today, if your architectural description of some software doesn't include graphics, and if possible a simulation, then your explanation "didn't happen".

The main inspiration for me were the many talks by [Bret Victor](http://vimeo.com/worrydream), specifically the concepts introduced here: [Explorable Explanations](http://worrydream.com/ExplorableExplanations/). What would you prefer, a 1000 words text explaining how RabbitMQ _basic.qos_ settings work, or a live simulation where you can tweak parameters and see the effects right away? I would prefer the later, backed with the minimum amount of theory to explain me what's going on.

Also a talk by Lea Verou where she used the tool [CSSS](http://leaverou.github.io/CSSS/#intro) to do her whole presentation was a great inspiration, since me, a design impaired person, could understand the wonders of the new CSS3.

## Generative Art ##

Processing got me interested into Generative Art. While I didn't do any interesting experiment in the topic, I used books about the topic to learn more about Processing and what could be possible with the platform. Two interesting books are: [Generative Art](http://www.amazon.com/Generative-Art-Matt-Pearson/dp/1935182625) and [Generative Design: Visualize, Program, and Create with Processing](http://www.amazon.com/Generative-Design-Visualize-Program-Processing/dp/1616890770/). The later book is simply amazing, from the cover design, to the binding, the paper quality, the graphics inside the book, everything! It's an amazing book to have just by the looks! What is interesting is how they present each concept in one or two pages, using a couple of graphics to see the result, plus code examples that go straight to the point.

## RabbitMQ Internals ##

In 2013 I retook my [old quest](https://github.com/videlalvaro/rabbit-internals) of diving into RabbitMQ's internals. I've learnt a lot about what's going on inside the server. From basic things on using pattern matching to [validate user ids](http://videlalvaro.github.io/2013/09/rabbitmq-validating-user-ids-with-erlang-pattern-matching.html) to more advanced concepts like [Credit Flow](http://videlalvaro.github.io/2013/09/rabbitmq-internals-credit-flow-for-erlang-processes.html). The whole series of blog posts can be found [here](http://videlalvaro.github.io/internals.html). I plan to expand it in the future.

I've gave a talk about it at the High Load++ conference in Russia: [Dissecting the Rabbit - RabbitMQ Internal Architecture](http://www.slideshare.net/old_sound/dissecting-the-rabbit). Also, I took part of one of the [Vive Codigo](http://vivecodigo.org) podcast episodes, where I explain Erlang concepts using RabbitMQ as the running example. The video is [here](http://vivecodigo.org/2013/10/02/episodio-4-de-la-temporada-1-erlang-con-alvaro-videla-old_sound/) (in Spanish).

## Pattern Matching, Tries and more ##

RabbitMQ internals took me to pattern matching in strings. How? I wanted to write a plugin that provided a new type of exchange called the [reverse topic exchange](https://github.com/videlalvaro/rabbitmq-rtopic-exchange). You can read more about the exchange in its README. 

The main problem I had is that one of the most efficient data structures for this kind of problem are [Tries](http://en.wikipedia.org/wiki/Trie). While tries are very efficient for prefix based searches, they are very inefficient for suffix based searches, unless you build a reverse trie of the keys you'd want to search for later.

Assuming you can build a reverse trie, the next issue my matching problem had was _extended matching_, where you can use classes of characters, or bounded gaps in the patterns and so on. Trying to solve this problem I went to the classic books by [Sedgewick](http://www.amazon.com/Algorithms-Parts-1-5-Bundle-Fundamentals/dp/0201756080/), [TAOCP](http://www.amazon.com/Computer-Programming-Volumes-1-4A-Boxed/dp/0321751043/) by Knuth and probably some other book from my shelf. Sadly I couldn't find a proper algorithm that was efficient for all cases of the [problem](https://github.com/videlalvaro/rabbitmq-rtopic-exchange#performance). That is, searches by suffix, by prefix, searches with gaps, or _key contains pattern_ kind of searches. Of course I could transform the routing key with patterns into a regex, and then run that against every binding key, but that was not the point of the algorithm.

That led me to this marvelous book: [Flexible Pattern Matching in Strings: Practical On-Line Search Algorithms for Texts and Biological Sequences](http://www.amazon.com/Flexible-Pattern-Matching-Strings-Algorithms/dp/0521039932). The book not only does an amazing job explaining the algorithms, it's also straight to the point, well organized and small. A very good book to have in hand when attacking these kind of problems.

### Bit Parallelism ###

For me one of the best things I've got from the _Flexible Pattern Matching in Strings_ book was the concept of __bit parallel__ algorithms, that is, algorithms that use bit-masks to perform many calculations at once. One example of these kind of algorithms is the _Shift And_ algorithm, which I can easily say that it's a work of Art. If you can't access that book, there's a good explanation of the algorithm here: [Bit-parallel string matching](http://www.mi.fu-berlin.de/wiki/pub/ABI/AdvancedAlgorithms11_Searching/script-03-ShiftOrUkkonenBitVecMyers.pdf). I've plan to do a post on the topic soon, since it's really fascinating.

### The Burrows-Wheeler Transform ###

The book also led to me to learning about the [BWT](http://en.wikipedia.org/wiki/Burrows%E2%80%93Wheeler_transform), which similar to Shift-And is another piece of art. How did Mr. Wheeler came up with the idea of the BWT is unbeknownst to me. Then I started reading more about the topic and it happened that [Mr. David Wheeler](http://www.thocp.net/biographies/wheeler_david.htm) basically invented subroutines, or wrote the [first book about programming digital computers](http://www.amazon.com/preparation-programs-electronic-digital-computer/dp/093822803X). If there was a website about [computer-scientist-badass of the week](http://www.badassoftheweek.com/) he would be there, along the likes of Grace Murray Hopper, Donald E. Knuth and John McCarthy among others.

I'm still reading about the topic. I was lucky enough to get hold of a copy of this book: [The Burrows-Wheeler Transform: Data Compression, Suffix Arrays, and Pattern Matching](http://www.amazon.com/The-Burrows-Wheeler-Transform-Compression-Matching/dp/0387789081/), and I've plan to finish it during this year.

## Bit, Bytes and Knuths ##

The __Shift And__ algorithm showed me that there are many interesting things that could be done if we become familiar with how bits and bytes work. This might sound obvious, after all we are working with computers. The problem is that usually we are working at higher levels, whether it's OOP concepts as in the traditional Java sense, processes in the Erlang world, or even pure functions and types in Haskell, we don't tend to use bits and bit masks every day (or maybe it's just me).

In any case the interests in bits took me again to TAOCP, in this case the chapter about _Combinatorial Searching_ from _Volume 4A_. While I can't claim that I understand everything that's presented there, there's a good deal of fascinating techniques about bits, bytes, bit masks and more.

For example, I had no idea that we could use only eight 64-bit numbers to tell if a number less than 1024 is prime; or that a solution for the [Chinese Ring Puzzle](http://chinesepuzzles.org/nine-linked-rings/) was related with binary numbers. I grant you that these are not your every day computer science problems. My point here is that, there are many techniques we ignore about using bit and bytes that might help us solve problems that otherwise would have very complicated solutions (pre building arrays, looping and so on).

Also it's worth mentioning that for some reason that first chapter from Volume 4A has a whole section on Graph Theory, which being this a book by Knuth, it's full of math's about graphs. For me that was actually and advantage, since the concepts of graphs were clearly defined. I went back to [Sedgewick](http://www.amazon.com/Algorithms-Parts-1-5-Bundle-Fundamentals/dp/0201756080/) to compare and I kinda felt lost in all the definitions based in _plain english_ vs math. The more I read Knuth, the more I like his approach to teaching Computer Science. 

Apart from bit related things, I peaked over many topics from TAOCP, specifically some combinatoric problems like _generating all n-tuples_, and Volume Two section on _Positional Number Systems_ and different radixes, like binary and so on.

My take on this is that, while daunting, TAOCP is not scary at all. I could read it and understand parts from it, you can do it too, don't be afraid of this almost mythological book. There's a lot to learn from it.

## Distributed Systems ##

Last year I also decided to get some more formal education with regards to distributed systems. For some reason I bumped into this book [Fault-Tolerant Real-Time Systems: The Problem of Replica Determinism](http://www.amazon.com/Fault-Tolerant-Real-Time-Systems-Determinism-International/dp/1475770286/) and got hooked. The book has a very methodic explanation of the different concepts and problems from distributed systems. It cites many papers as well, so it's a nice read to get into context and understand what someone might mean when they say "Byzantine failure", "Consistency", "Replica Determinism", "Atomic Broadcast", or things like [states of knowledge](http://www.cs.cornell.edu/home/halpern/papers/common_knowledge.pdf).

I started a [series of blog posts](http://videlalvaro.github.io/2013/12/failure-modes-in-distributed-systems.html) on the topic, mostly commenting the Yellow Book, which I plan to expand along the year.

Why am I learning this? I want to be able to reason and document RabbitMQ's distributed components, specifically the [Guaranteed Multicast](http://hg.rabbitmq.com/rabbitmq-server/file/bb9b95480101/src/gm.erl) module and related components. 

I've also got this book: [Distributed Algorithms for Message-Passing Systems](http://www.amazon.com/Distributed-Algorithms-Message-Passing-Systems-Michel/dp/3642381227) which I've reading as well –yes, I buy a lot of books and I read a lot of books in parallel.

I liked how that book explains the concept of time in distributed systems, and why a concept like vector clocks is needed.

## Queueing Theory ##

Is there anything to learn from queueing and scheduling theory that could help me better utilize RabbitMQ? Sure there is, and guess what, there are tons of books about it. Again, I've bought yet another book, this time called [Performance Modeling and Design of Computer Systems: Queueing Theory in Action](http://www.amazon.com/Performance-Modeling-Design-Computer-Systems/dp/1107027500/).

This book is really great. Instead of the boring here's more math, that explains the math in the previous page, that explained the math from the chapter title, you get a very easy going _questions & answers_ kind of book. Yes, there is math, but thanks to the questions posed by the author, you get to understand why you'll need said math.

Apart from that, this book helped me see how usually when we do performance optimization we are really just _shooting in the dark_. Yes, I know that we usually collect metrics to see what are the most visited pages on the website to optimize those first; or we check the Nginx logs to find out what are the slowest ones, and so on. Then a profiler could pinpoint what functions are slow, and we go and optimize those. Well, I'm not talking about that particular kind of optimization. In this case queueing theory can let you answer questions like: do I need two big servers for this website, or many small ones? Shall I add more consumers to my queues or improve the job scheduling strategy? Also I see companies bragging about how they handle the extra load during _holiday x_ that brought _Y_ more to their websites. People claim things like: "thanks to cloud vendor X, we could just fire 1000 servers and that was that, problem solved". While this is cool, did you really need 1000 servers? Where did the 1000 number came from anyway? This book could help you answer that and many more questions about performance and capacity planning. I wrote about one of the many concepts from that book here: [Using Consumer Priorities with RabbitMQ](http://www.rabbitmq.com/blog/2013/12/16/using-consumer-priorities-with-rabbitmq/).

## Conclusion ##

First, sorry for the long blog post, but I wanted to write this down somewhere. I think the books, links and papers that I shared above are useful to you, and of course, to a future me. All in all my conclusion is: someone before us had the same problem we are trying to solve, and that person probably documented it somewhere, or published their solution as open source (hopefully).

There is no need to repeat ourselves, or others. If we have problem `x`, there's probably tons of literature on how to solve `X`. _There's an algorithm for that_. We just need to be humble enough, put on the student hat, and grab a book. They really don't bite and they can save us hours of experimenting and head scratching. I've prefer to scratch my head by reading TAOCP than by trying naively to solve some [boolean SAT](http://en.wikipedia.org/wiki/Boolean_satisfiability_problem) without even knowing that I'm getting into that particular kind of problem. 

I leave you with an anecdote:

The other day somebody asked on the RabbitMQ about how the get data as fast as possible from China to the US, the problem being that upload bandwidth between China and the US is very low. At that time I happened to be reading about _Network Flows_ and the [Ford-Fulkerson algorithm](http://en.wikipedia.org/wiki/Ford–Fulkerson_algorithm) which gave me the following idea. This company had many data centers in Asia, namely Japan and Korea, so for example instead of sending the data directly to the US, assuming that a direct path is better, one could try to send the data from China to Japan and from there to the US. Using the same concept, data could travel from China to Korea, then to Japan and the US, or to the US directly from Korea. Of course this had to be experimented first in order to validate the idea. The point is, that this wouldn't occurred to me if I hadn't read about the Ford-Fulkerson algorithm.