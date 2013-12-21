---
layout: post
title: Failure modes in distributed systems
categories: ['books-commentary', 'distributed-systems', 'yellow-book']
---

# {{page.title}} #

<span class="meta">December 20 2013</span>

As I said in my previous blog post, I've been reading the book [Fault-Tolerant Real-Time Systems: The Problem of Replica Determinism](http://www.amazon.com/Fault-Tolerant-Real-Time-Systems-Determinism-International/dp/1475770286/), which now I call _"The Yellow Book"_. Since the book is small and self-contained, I've found it very good to get an introduction to Distributed Systems. It has a very good section with a list of papers that the book cites, so one can go deeper if interested.

The book has a section that presents the different **failure modes for distributed systems** as perceived for the user of those systems. For me it was quite interesting to see a summary of them and the relation between them, i.e.: how more severe failure modes cover less severe failure modes. Yep, it sounds pretty obvious but it wasn't for me when I was reading the book.

The modes are:

- **Byzantine or arbitrary failures**

In this case a server can send a message stating that fact `φ` is `true` to some servers, but to others it may reply that fact `φ` is `false`. Apart from that, the server might be able to forge messages from other servers, i.e.: saying that according to server S1 fact `φ` is `true` when it's actually `false` according to S1.

- **Authentification detectable byzantine failures**

In this case a server may show byzantine failures but it cannot lie about facts sent by other servers.

- **Performance failures**

This is one is pretty simple to understand. While the server is delivering the correct values, they arrive at the wrong time, either early or late.

- **Omission failures**

This is a special case of the previous one. The server is replying "infinitely late".

- **Crash failures**

When a server suffers from an _omission failure_ and then stops responding.

- **Fail-stop failures**

In this type of failure, the server only exhibits _crash failures_, but at the same time, we can assume that any correct server in the system can detect that this particular server has failed.

##  Relations between failure modes ##

These failure modes, having byzantine failures as the more severe and fail-stop failures as the less severe, show what kind of assumptions we can make about a server. With byzantine failures we can't make no assumptions at all. Which server failed, which server is correct? Who knows? With `fail-stop failures` we know that server S has failed. With that in mind we can say that severe failures _contain_ or _cover_ less severe failures. So if we know a set of servers might show _performance failures_, then we can assume the servers will also show _omission failures_. More formally: Byzantine failures ⊃ authentification detectable byzantine failures ⊃ performance failures ⊃ omission failures ⊃ crash failures ⊃ fail-stop failures.

The aforementioned failure modes can be divided in _Value failures_ and _Timing failures_. The byzantine failure modes are value failures, while the others are timing failures.

Also they can be seen as _Consistent failures_ or _Inconsistent failures_. That is, how service users see the failure modes. In the first case, all users perceive the same failures. All the performance failures modes are in this category. Then under inconsistent failures we have the byzantine ones, where different users of the service might get different perceptions of the failure. Keep in mind that users of the systems might be other servers in our architecture, not necessarily "human users".

## Failure semantics ##

The previous distinctions between failure modes bring us to something that for me is quite interesting to reason about: failure semantics. By quoting the book:

>**Failure semantic**: a server exhibits a given failure semantic if the probability of failure modes which are not covered by the failure semantic is sufficiently low.

So if a server S1 is said to have "crash failure semantics", then the possibility of having, say, byzantine failure should be very low. With this in mind, a service user of the previous server S1 only needs to consider that S1 will only fail with "crash failure semantics". 

For me the interesting part of thinking about failure semantics are in say, a system like RabbitMQ that internally is made of many Erlang processes that talk to each other. What are the failure semantics of those subsystems? How do other processes using those subsystems behaving on the presence of failures? What's the role for the Erlang supervision tree here? All these are interesting question that I've plan to answer soon.

{% include yellow_book.html %}