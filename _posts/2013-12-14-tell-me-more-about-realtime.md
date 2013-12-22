---
layout: post
title: Tell me more about your real-time systems
categories: ['books-commentary', 'yellow-book']
---

# {{page.title}} #

<span class="meta">December 14 2013</span>

I've been reading the book [Fault-Tolerant Real-Time Systems: The Problem of Replica Determinism](http://www.amazon.com/Fault-Tolerant-Real-Time-Systems-Determinism-International/dp/1475770286/) and I've been sincerely blown out by the content. The book is really interesting, and even more for me: a complete n00b with regards to real-time systems. 

The second chapter gives an introduction about automotive electronics, since the "distributed systems" explained in the book are in fact cars internal electronics. In this short blog post I'd like to share a paragraph from that chapter:

>High activation frequencies: In automotive electronics there are functions which require high service activation frequencies. Some control loops require sampling frequencies of up to 4 kHz. In engine control control applications even higher service activation frequencies are required to monitor the actual position of the crankshaft or camshaft. Some systems resolve one revolution of the engine with an accuracy of 6 degrees. By considering a maximum engine speed of 7000 rpm the time interval between the passage of 6 degree crank  shaft is as little as 142µs. This results in a service activation frequency of 7 kHz for the service which monitors the crank angle position. For these reasons cumulated service activation frequencies of up to 10kHz are assumed. To achieve these high activation frequencies the context switch between different tasks has to be very efficient.

By reading descriptions like this I kind of understand some people dislike of the use of the term _"real-time"_ for systems that are in fact not real-time at all. I think the current evolution of technical language around web developers has made real-time mean: _"consume information as soon as it is available"_ and not _"react to the information in a timely manner or this car will crash"_.

{% include yellow_book.html %}