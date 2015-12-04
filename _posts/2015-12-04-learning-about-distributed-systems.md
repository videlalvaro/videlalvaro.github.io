---
layout: post
title: "What We Talk About When We Talk About Distributed Systems"
---

# {{page.title}} #

For quite some time now I've been trying to learn about distributed
systems, and it's appropriate to say that once you start digging,
there seems to be no end to it, the rabbit hole goes on and on. The
literature in distributed systems is quite extensive, with lots of
papers coming from different universities, plus quite a few books to
choose from. For a total beginner like me, it proved hard to decide
what paper to read, or what book to buy.

At the same time, I've found that several bloggers recommend this or
that paper that one must know in order to become a _distributed
systems engineer_ (whatever that means). So the list of things to read
grows:
[FLP](http://cs-www.cs.yale.edu/homes/arvind/cs425/doc/fischer.pdf),
[Zab](http://web.stanford.edu/class/cs347/reading/zab.pdf),
[Time, Clocks and the Ordering of Events in a Distributed Systems](http://research.microsoft.com/en-us/um/people/lamport/pubs/time-clocks.pdf),
[Viewstamped Replication](http://pmg.csail.mit.edu/papers/vr.pdf),
[Paxos](http://research.microsoft.com/en-us/um/people/lamport/pubs/lamport-paxos.pdf),
[Chubby](http://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf)
and on and on. My problem is that many times I don't see a
justification of _why_ should I read this or that paper. I love the
idea of learning just for knowledge's sake, to satisfy curiosity, but
at the same time one needs to prioritise what to read, since the day
only has 24hs.

Apart from the abundance of papers and research material, as mentioned
above, there are also lots books. Having bought quite a few of them
and read chapters here and there, I started to see that a book that
had a promising title, was quite unrelated to what I was looking for,
or that the content didn't directly target the problems I would have
liked to solve. Therefore, I would like to go over what I think are
the main concepts of distributed systems, citing papers, books or
resources where one can learn about them.

As I'm continuously learning while writing these words, please have
some patience, expect some mistakes, and be aware that I will try to
expand whatever I end up writing here.

Before we start, I must tell you that I have presented this blog post
at various conferences, so here are the slides if you are interested:

<p>
<script async class="speakerdeck-embed"
data-id="5f16b66144bb4d0ba5aac87488efecf6" data-ratio="1.7"
src="//speakerdeck.com/assets/embed.js"></script>
</p>

And here's a video of when I presented this talk at the Erlang User
Conference in Stockholm:

<p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/yC6b0709HCw" frameborder="0" allowfullscreen></iframe>
</p>

Let's start with the article:

## Main Concepts ##

Distributed systems algorithms can be classified according to
different kinds of attributes. Some classifications are: the timing
model; the kind of interprocess communication used; the failure model
assumed for the algorithm; and many others as we will see.

### Timing Model ###

Here we have the _synchronous model_, the _asynchronous model_ and the
_partially synchronous model_.

The **synchronous model** is the simplest one to use; here components
take steps simultaneously, in what are called _synchronous
rounds_. The time for a message to be delivered is usually known, and
we also can assume the speed of each process, ie.: how long it takes
for a process to execute one step of the algorithm. The problem with
this model is that it doesn't reflect reality so well, even less in a
distributed system context, where one can send a message to another
process, and wish that the stars are aligned for us, so the message
arrives to said process. The good thing is that using this model it is
possible to achieve theoretical results that later can be translated
to other models. For example, due to the guarantees of this model
about time, we could see that if a problem cannot be solved under
these timing guarantees, then it would probably be impossible to solve
once we relax them (think of a Perfect Failure Detector for instance).

The **asynchronous model** gets a bit more complex. Here components
can take steps in whatever order they choose and they don't offer any
guarantee about the speed in which they will take such steps. One
problem with this model is that while it can be simple to describe and
closer to reality, it still doesn't reflects it properly. For example
a process might take infinitely long to respond to a request, but in a
real project, we would probably impose a timeout on said request, and
once the time out expires we will abort the request. A difficulty that
comes with this model is how to assure the liveness condition of a
process. One of the most famous _impossibility results_, the
["Impossibility of Consensus with one Faulty Process"](http://cs-www.cs.yale.edu/homes/arvind/cs425/doc/fischer.pdf)
belongs to this timing model, where it is not possible to detect if a
process has crashed, or if the process is just taking infinitely long
time to reply to a message.

In the **partially synchronous model**, components have some
information about timing, having access to almost synchronised clocks,
or they might have approximations of how long messages take to be
delivered, or how long it takes a processes to execute a step.

The book
[Distributed Algorithms](http://www.amazon.com/Distributed-Algorithms-Kaufmann-Management-Systems/dp/1558603484)
by Nancy Lynch is actually organised in sections based on these timing
models.

### Interprocess Communication ###

Here we need to think about _how_ processes in the system exchange
information. They can do it by sending messages to each other, in the
**message passing** model, or by using the **shared memory** model,
where they share data by accessing shared variables.

One thing to keep in mind is that we can use a message passing
algorithm to build a distributed shared memory object. Common examples
in books is the implementation of a read/write register. We also have
queues and stacks, which are used by some authors to describe
consistency properties, like
[linearizabilty](https://cs.brown.edu/~mph/HerlihyW90/p463-herlihy.pdf). We
should not confuse _shared memory_ as a way to share data between
process, by accessing a shared variable, with _shared memory
abstractions_ built on top of message passing, like the ones just
mentioned.

Back to the message passing model, we have another abstraction to
consider when trying to understand algorithms: the kind of link used
between processes (think of channels used to send messages back and
forth between processes). These links will offer certain guarantees to
the algorithm using them. For example there's the _Perfect Links_
abstraction that has reliable delivery and sends no duplicates; this
abstraction also assures exactly once delivery. We can easily see that
this abstraction doesn't reflect the real world either, therefore
there are other kinds of link abstractions used by algorithm designers
when they try to design models that are closer to real systems. Keep
in mind that even if the _Perfect Links_ abstraction is not so real,
it can still be useful, for example if we can prove a problem is not
possible to solve even assuming perfect links, then we know of a whole
bunch of related problems which might not be solvable as well. On the
topic of links authors usually consider or assume FIFO message
ordering, like in
[Zab](http://web.stanford.edu/class/cs347/reading/zab.pdf)

### Failure Modes ###

I already wrote an article about
[failure modes in distributed systems](http://videlalvaro.github.io/2013/12/failure-modes-in-distributed-systems.html)
but is worth reiterating here. A property of a distributed system
model is what kind of process failures are assumed. On the
_crash-stop_ failure mode, a process is assumed to be correct until it
crashes. Once it crashes, it never recovers. There's also the
_crash-recovery model_, where processes can recover after a fault, in
this case, some algorithms also include a way for the process to
recover the state it had before before crashing. This can be done
either by reading from persistent storage or by communicating with
other processes in a group. It's worth noting that for some group
membership algorithms, a process that crashes and then recovers could
not be considered as the same process that was alive before. This
usually depends if we have dynamic groups or fixed groups.

There's also failure modes where processes fail to receive or send
messages, these are called _omission failure mode_. There are
different kind of omissions as well, a process can fail to receive a
message, or to send a message. Why does this matter? Imagine the
scenario where a group of processes implement a distributed cache. If
a process is failing to reply to requests from other processes on the
group, even tho it is able to receive requests from them, that process
will still have its state up to date, which means it can reply to read
requests from clients.

A more complex failure mode is the one called Byzantine or _arbitrary
failures_ mode, where processes can send wrong information to their
peers; they can impersonate processes; reply to other process with the
correct data, but garble it's local database contents, and more.

When thinking about the design of a system, we should consider which
kind of process failures we want to cope with. Birman (see
[Guide to Reliable Distributed Systems](http://www.amazon.com/gp/product/1447124154))
argues that usually we don't need to cope with Byzantine failures. He
cites work done at Yahoo! where they concluded that crash failures are
way more common than Byzantine failures.

### Failure Detectors ###

Depending on the process failure mode and timing assumptions we can
construct abstractions that take care of reporting to the system if a
process has crashed, or if it is suspected to have crashed. There are
_Perfect Failure_ detectors that never give a false positive. Having a
crash-stop failure mode plus a synchronous system, we can implement
this algorithm by just using timeouts. If we ask processes to
periodically ping back to the Failure Detector Process, we know
exactly when a ping should arrive to the failure detector (due to the
synchronous model guarantees). If the ping doesn't arrive after
certain configurable timeout, then we can assume the other node has
crashed.

On a more realistic system, it might not be possible to always assume
the time needed for a message to reach its destination, or how long
will it take for a process to execute a step. In this case we can have
a failure detector `p` that would report a process `q` as _suspected_
if `q` doesn't reply after a timeout of `N` milliseconds. If `q` later
replies, then `p` will remove `q` from the list of suspected
processes, and it will increase `N`, since it doesn't know what's the
actual network delay between itself and `q`, but it wants to stop
suspecting `q` of having crashed, since `q` was alive, but it was just
taking longer than `N` to ping back. If at some point `q` crashes,
then `p` will first suspect it has crashed, and it will never revise
its judgement (since `q` will never ping back). A better description
of this algorithm can be found in
[Introduction to Reliable and Secure Distributed Programming](http://www.amazon.com/Introduction-Reliable-Secure-Distributed-Programming/dp/3642152597/)
under the name "Eventually Perfect Failure Detector".

Failure Detectors usually offer two properties: completness and
accuracy. For the _Eventually Perfect Failure Detector_ type, we have
the following:

- **Strong Completeness**: Eventually, every process that crashes is
  permanently suspected by every correct process.
- **Eventual Strong Accuracy**: Eventually, no correct process is
  suspected by any correct process.

Failure detectors have been crucial in solving consensus in the
asynchronous model. There's quite a famous impossibility result
presented in the
[FLP](http://cs-www.cs.yale.edu/homes/arvind/cs425/doc/fischer.pdf)
paper mentioned above. This paper talks about the impossibility of
consensus in asynchronous distributed systems where one process might
fail. On way to go around this impossibility result is to introduce a
failure detector that can
[circumvent the problem](http://www.cs.utexas.edu/~lorenzo/corsi/cs380d/papers/p225-chandra.pdf).

### Leader Election ###

Related to the problem of failure detectors is that of actually doing
the opposite, to determine which process hasn't crashed and is
therefore working properly. This process will then be trusted by other
peers in the network and it will be considered as the leader that can
coordinate some distributed actions. This is the case of protocols
like [Raft](https://raft.github.io) or
[Zab](https://web.stanford.edu/class/cs347/reading/zab.pdf) that
depend on a leader to coordinate actions.

Having a leader in a protocol introduces asymmetry between nodes,
since non-leader nodes will then be followers. This will have the
consequence that the leader node will end up being a bottleneck for
many operations, so depending on the problem we are trying to solve,
using a protocol that requiers leader election might not be what we
want. Note that most protocols that achieve consistency via some sort
of consensus, use a leader process, and a set of followers. See
[Paxos](http://research.microsoft.com/en-us/um/people/lamport/pubs/lamport-paxos.pdf),
[Zab](https://web.stanford.edu/class/cs347/reading/zab.pdf) or
[Raft](https://raft.github.io) for some examples.

### Consensus ###

The consensus or agreement problem was first introduced in the paper
[Reaching Agreement in the Presence of Faults](http://research.microsoft.com/en-us/um/people/lamport/pubs/reaching.pdf)
by Pease, Shostak and Lamport. There they introduced the problem like
this:


>Fault-tolerant systems often require a means by which independent
 processors or processes can arrive at an exact mutual agreement of
 some kind. It may be necessary, for example, for the processors of a
 redundant system to synchronise their internal docks periodically. Or
 they may have to settle upon a value of a time-varying input sensor
 that gives each of them a slightly different reading.

So consensus is a problem of reaching agreement among independent
processes. These processes will propose some values for a certain
problem, like what's the current reading of their sensor, and then
agree on a common action based on the proposed values. For example, a
car might have various sensors providing it with information about the
breaks temperature levels. These readings might have some variations
depending on the precision of each sensor and so on, but the ABS
computer needs to agree on how much pressure it should apply on the
breaks. That's a consensus problem being solved in our everyday lives.
The book
[Fault-Tolerant Real-Time Systems](http://www.springer.com/us/book/9780792396574)
explains consensus an other problems in distributed systems in the
context of the automotive industry.

A process that implements some form of consensus works via exposing an
API with _propose_ and _decide_ functions. A process will propose
certain value when consensus starts and then it will have to decide on
a value, based on the values that were proposed in the system. These
algorithms must satisfy certain properties, which are: Termination,
Validity, Integrity and Agreement. For example for _Regular Consensus_
we have:

- **Termination**: Every correct process eventually decides some value.
- **Validity**: If a process decides _v_, then _v_ was proposed by some
  process.
- **Integrity**: No process decides twice.
- **Agreement**: No two correct process decide differently.

For more details on consensus please consult the original paper
mentioned above. Also the following books are a great reference:

- [Introduction to Reliable and Secure Distributed Programming](http://www.amazon.com/Introduction-Reliable-Secure-Distributed-Programming/dp/3642152597/), Chapter 5.
- [Fault-tolerant Agreement in Synchronous Message-passing Systems](http://www.amazon.com/Fault-tolerant-Agreement-Synchronous-Message-passing-Distributed/dp/1608455254/).
- [Communication and Agreement Abstractions for Fault-tolerant Asynchronous Distributed Systems](http://www.amazon.com/Communication-Abstractions-Fault-tolerant-Asynchronous-Distributed/dp/160845293X/).

### Quorums ###

Quorums are a tool used for designing fault-tolerant distributed
systems. Quorums refer to intersecting sets of processes that can be
used to understand the characteristic of a sytem when some processes
might fail.

For example if we have an algorithm where N process have crash-failure
modes, we have a quorum of processes whenever we have a majority of
processes applying certain operation to the system, for example a
write to the database. If a minority of process might crash, that is
`N/2 - 1` process crashes, we stil have a majority of processes that
know about the last operation applied into the system. For example
Raft uses majorities when committing logs to the system. The leader
will apply an entry to its state machine as soon as half the servers
in the cluster have replied to its request of log replication. The
leader plus half the servers constitute a majority. This has the
advantage that Raft doesn't need to wait for the whole cluter to reply
to a log-replication RPC request.

Another example would be: let's say we want to limit the access to a
shared resource by one process at a time. This resource is guarded by
a set `S` of processes. Whenever process `p` wants to access the
resource it needs to first ask permission to a majority of the
processes `S` guarding the resource. A majority of processes in `S`
grant access to the resource to `p`. Now process `q` arrives into the
system and tries to access the shared resource. No matter which
processes it contacts in `S`, `q` will never arrive to a majority of
processes that will grant it access to the shared resource until the
resource is freed by `p`. See
[The Load, Capacity, and Availability of Quorum Systems](http://www.cs.utexas.edu/~lorenzo/corsi/cs395t/04S/notes/naor98load.pdf)
for more details.

Quorums don't always refer to a majority of processes. Sometimes they
even need more processes to form a quorum for an operation to succeed,
like in the case of a group `N` processes that can suffer Byzantine
failures. In this case if `f` is the number of tolerated process
failures, a quorum will be a set of more than `(N + f) / 2` processes
See
[Introduction to Reliable and Secure Distributed Programming](http://www.amazon.com/Introduction-Reliable-Secure-Distributed-Programming/dp/3642152597/).

If you are interested in this topic, there's a whole book dedicated to
quorums in distributed systems:

[Quorum Systems: With Applications to Storage and Consensus](http://www.amazon.com/Quorum-Systems-Applications-Consensus-Distributed/dp/1608456838/)

### Time in Distributed Systems ###

Understanding time and its consequences is one of the biggest problems
in distributed systems. We are used to the concept of events in our
life happening one after the other, with a perfectly defined
[happened before](https://en.wikipedia.org/wiki/Happened-before)
order, but when we have a series of distributed processes, exchanging
messages, accessing resources concurrently, and so on, how can we tell
which process event happened before? To be able to answer these kind
of questions, processes would need to share a synchronised clock, and
know exactly how long it takes for electrons to move around the
network; for CPUs to schedule tasks, and so on. Clearly this is not
quite possible on a real-world system.

The seminal paper that discusses these issues is called
[Time, Clocks, and the Ordering of Events in a Distributed System](http://research.microsoft.com/en-us/um/people/lamport/pubs/time-clocks.pdf)
which introduced the concept of logical clocks. Logical Clocks are a
way of assigning a number to an event in the system; said numbers are
not related to the actual passage of time, but to the processing of
events by a node in a distributed system.

There are many kinds of logical clocks algorithms, like
[Vector Clocks](http://zoo.cs.yale.edu/classes/cs426/2012/lab/bib/fidge88timestamps.pdf)
or
[Interval Tree Clocks](http://gsd.di.uminho.pt/members/cbm/ps/itc2008.pdf).

For a very interesting discussion on time in distributed systems I
recommend reading the article
[There Is No Now](https://queue.acm.org/detail.cfm?id=2745385) by
Justin Sheehy.

I would claim that time and its problems in distributed systems are
one of the crucial concepts to understand. **The idea of simultaneity
is something we have to let go**. This is related with the old belief
of "Absolute Knowledge", where we used to think that such a thing as
absolute knowledge was attainable. The laws of physics show us that
even light requires some time in order to get from one place to
another, so whenever it reaches our eyes, and it's processed by our
brains, whatever the light is communicating, it's and old view of the
world. This idea is discussed by Umberto Eco in the book
[Inventing the Enemy](http://www.amazon.com/Inventing-Enemy-Essays-Umberto-Eco/dp/0544104684),
chapter "Absolute and Relative".

## A Quick look at FLP ##

To finalize this article, let's take a quick look at the
**Impossibility of Distributed Consensus with One Faulty Process**
paper to try to related the concepts we have just learnt about
distributed systems.

The abstract starts like this:

>The consensus problem involves an asynchronous system of processes,
 some of which may be unreliable.

So we have an _asynchronous system_, where no timing assumptions are
made, either on processing speed or the time required for messages to
reach other processes. We also know that some of these process may
crash.

The issue here is that in usual technical jargon,
[asynchronous](https://en.wikipedia.org/wiki/Asynchronous_I/O) might
refer to a way of processing requests, like RPC for example, where a
process _p_ sends an asynchronous request to process _q_, and while
_q_ is processing the request, _p_ keeps doing other things, that is:
_p_ doesn't block waiting for a reply. We can see that this definition
is completely different from the one used in the distributed systems
literature, so without having this knowledge, it's quite hard to fully
understand the meaning of just the first sentence of the FLP paper.

Later in the paper they say:

>In this paper, we show the surprising result that no completely
 asynchronous consensus protocol can tolerate even a single
 unannounced process death. We do not consider Byzantine failures, and
 we assume that the message system is reliable—it delivers all
 messages correctly and exactly once.

So the paper only considers the _crash-stop_ failure mode discussed
above (sometimes called _fail-stop_). We can also see that there are no omission failures, since the
message system is reliable.

And finally they also add this constraint:

>Finally, we do not postulate the ability to detect the death of a
 process, so it is impossible for one process to tell whether another
 has died (stopped entirely) or is just running very slowly.

So we can't use failure detectors either.

To recap, this means they FLP impossibility applies for asynchronous
systems with fail-stop processors, with access to a reliable message
system, and where detecting the death of a process is not
possible. Without knowing the theory related to the different models
of distributed systems, it might be possible that we miss many of
these details, or we just interpret them in a totally different way
from what the authors meant.

For a more detailed overview of FLP please take a look at this blog
post:
[A Brief Tour of FLP Impossibility](http://the-paper-trail.org/blog/a-brief-tour-of-flp-impossibility/)

Also, it is interesting to read the paper
[Stumbling over Consensus Research: Misunderstandings and Issues](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.174.8238&rep=rep1&type=pdf)
by Marcos Aguilera, which has a discussion about what it means for FLP
to be an _impossibility result_ for distributed systems (spoiler
alert: is not the same level of _impossibility_ as the [halting
problem](https://en.wikipedia.org/wiki/Halting_problem)).


## Conclusion ##

As you can see, learning about distributed systems takes time. It's a
very vast topic, with tons of research on each of its sub-areas. At
the same time implementing and verifying distributed systems is also
quite complex. There are many subtle places where to commit mistakes
than can make our implementations totally broken under unexpected
circumstances.

What if we choose the wrong quorum and then our new fancy replication
algorithm loses critical data? Or we choose a very conservative quorum
that slows down our application without need, making us break SLAs
with customers? What if the problem we are trying to solve doesn't
need consensus at all and we can live with eventual consistency?
Perhaps our system has the wrong timing assumptions? Or it uUses a
failure detector unfit for the underlying system properties? What if
we decide to optimise an algorithm like Raft, by avoiding a small step
here or there and we end up breaking it's safety guarantees? All these
things and many more can happen if we don't understand the underlying
theory of distributed systems.

OK, I get it, I won't reinvent the distributed systems wheel, but with
such vast literature and set of problems, where to start then? As
stated at the top of this article I think randomly reading papers will
get you nowhere, as shown with the FLP paper, where understanding the
first sentence requires to know about the various timing
models. Therefore I recommend the following books in order to get
started:

[Distributed Algorithms](http://www.amazon.com/gp/product/1558603484)
by Nancy Lynch. This book is kinda the bible of distributed
systems. It covers the various models cited above, having sections
with algorithms for each of them.

[Introduction to Reliable and Secure Distributed Programming](http://www.amazon.com/Introduction-Reliable-Secure-Distributed-Programming/dp/3642152597/)
by Christian Cachin et al. Besides from being a very good
introduction, it covers many kinds of consensus algorithms. The book
is full of pseudo-code explaining the algorithms which is a good thing
to have.

Of course there are many more books, but I think these two are a good
start. If you feel you need to diver deeper, here's the list of
resources used in this article:

## References ##

- [Marcos K. Aguilera. 2010. Stumbling over consensus research: misunderstandings and issues. In Replication, Bernadette Charron-Bost, Fernando Pedone, and André Schiper (Eds.). Springer-Verlag, Berlin, Heidelberg 59-72.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.174.8238&rep=rep1&type=pdf)
- [Paulo Sérgio Almeida, Carlos Baquero, and Victor Fonte. 2008. Interval Tree Clocks. In Proceedings of the 12th International Conference on Principles of Distributed Systems (OPODIS '08), Theodore P. Baker, Alain Bui, and Sébastien Tixeuil (Eds.). Springer-Verlag, Berlin, Heidelberg, 259-274.](http://gsd.di.uminho.pt/members/cbm/ps/itc2008.pdf)
- [Kenneth P. Birman. 2012. Guide to Reliable Distributed Systems: Building High-Assurance Applications and Cloud-Hosted Services. Springer Publishing Company, Incorporated.](http://www.amazon.com/gp/product/1447124154)
- [Mike Burrows. 2006. The Chubby lock service for loosely-coupled distributed systems. In Proceedings of the 7th symposium on Operating systems design and implementation (OSDI '06). USENIX Association, Berkeley, CA, USA, 335-350.](http://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf)
- [Christian Cachin, Rachid Guerraoui, and Luis Rodrigues. 2014. Introduction to Reliable and Secure Distributed Programming (2nd ed.). Springer Publishing Company, Incorporated.](http://www.amazon.com/Introduction-Reliable-Secure-Distributed-Programming/dp/3642152597/)
- [Tushar Deepak Chandra and Sam Toueg. 1996. Unreliable failure detectors for reliable distributed systems. J. ACM 43, 2 (March 1996), 225-267.](http://www.cs.utexas.edu/~lorenzo/corsi/cs380d/papers/p225-chandra.pdf)
- [Umberto Eco. 2013. Inventing the Enemy: Essays. Mariner Books.](http://www.amazon.com/Inventing-Enemy-Essays-Umberto-Eco/dp/0544104684)
- [Colin J. Fidge. 1988. Timestamps in message-passing systems that preserve the partial ordering. Proceedings of the 11th Australian Computer Science Conference 10 (1) , 56–66.](http://zoo.cs.yale.edu/classes/cs426/2012/lab/bib/fidge88timestamps.pdf)
- [Michael J. Fischer, Nancy A. Lynch, and Michael S. Paterson. 1983. Impossibility of distributed consensus with one faulty process. In Proceedings of the 2nd ACM SIGACT-SIGMOD symposium on Principles of database systems (PODS '83). ACM, New York, NY, USA, 1-7.](http://cs-www.cs.yale.edu/homes/arvind/cs425/doc/fischer.pdf)
- [Maurice P. Herlihy and Jeannette M. Wing. 1990. Linearizability: a correctness condition for concurrent objects. ACM Trans. Program. Lang. Syst. 12, 3 (July 1990), 463-492.](https://cs.brown.edu/~mph/HerlihyW90/p463-herlihy.pdf)
- [Leslie Lamport. 1978. Time, clocks, and the ordering of events in a distributed system. Commun. ACM 21, 7 (July 1978), 558-565.](http://research.microsoft.com/en-us/um/people/lamport/pubs/time-clocks.pdf)
- [Leslie Lamport. 1998. The part-time parliament. ACM Trans. Comput. Syst. 16, 2 (May 1998), 133-169.](http://research.microsoft.com/en-us/um/people/lamport/pubs/lamport-paxos.pdf)
- [Nancy A. Lynch. 1996. Distributed Algorithms. Morgan Kaufmann Publishers Inc., San Francisco, CA, USA.](http://www.amazon.com/Distributed-Algorithms-Kaufmann-Management-Systems/dp/1558603484)
- [Moni Naor and Avishai Wool. 1998. The Load, Capacity, and Availability of Quorum Systems. SIAM J. Comput. 27, 2 (April 1998), 423-447.](http://www.cs.utexas.edu/~lorenzo/corsi/cs395t/04S/notes/naor98load.pdf)
- [Brian M. Oki and Barbara H. Liskov. 1988. Viewstamped Replication: A New Primary Copy Method to Support Highly-Available Distributed Systems. In Proceedings of the seventh annual ACM Symposium on Principles of distributed computing (PODC '88). ACM, New York, NY, USA, 8-17.](http://pmg.csail.mit.edu/papers/vr.pdf)
- [Diego Ongaro and John Ousterhout. 2014. In search of an understandable consensus algorithm. In Proceedings of the 2014 USENIX conference on USENIX Annual Technical Conference (USENIX ATC'14), Garth Gibson and Nickolai Zeldovich (Eds.). USENIX Association, Berkeley, CA, USA, 305-320.](http://ramcloud.stanford.edu/raft.pdf)
- [M. Pease, R. Shostak, and L. Lamport. 1980. Reaching Agreement in the Presence of Faults. J. ACM 27, 2 (April 1980), 228-234.](http://research.microsoft.com/en-us/um/people/lamport/pubs/reaching.pdf)
- [Stefan Poledna. 1996. Fault-Tolerant Real-Time Systems: The Problem of Replica Determinism. Kluwer Academic Publishers, Norwell, MA, USA.](http://www.amazon.com/Fault-Tolerant-Real-Time-Systems-Determinism-International/dp/079239657X/)
- [Michel Raynal. 2010. Communication and Agreement Abstractions for Fault-Tolerant Asynchronous Distributed Systems (1st ed.). Morgan and Claypool Publishers.](http://www.amazon.com/Communication-Abstractions-Fault-tolerant-Asynchronous-Distributed/dp/160845293X/)
- [Michel Raynal. 2010. Fault-tolerant Agreement in Synchronous Message-passing Systems (1st ed.). Morgan and Claypool Publishers.](http://www.amazon.com/Fault-tolerant-Agreement-Synchronous-Message-passing-Distributed/dp/1608455254/)
- [Benjamin Reed and Flavio P. Junqueira. 2008. A simple totally ordered broadcast protocol. In Proceedings of the 2nd Workshop on Large-Scale Distributed Systems and Middleware (LADIS '08). ACM, New York, NY, USA, , Article 2 , 6 pages.](http://web.stanford.edu/class/cs347/reading/zab.pdf)
- [Justin Sheehy. 2015. There Is No Now. ACM Queue](https://queue.acm.org/detail.cfm?id=2745385)
- [Marko Vukolic. 2012. Quorum Systems: With Applications to Storage and Consensus. Morgan and Claypool Publishers.](http://www.amazon.com/Quorum-Systems-Applications-Consensus-Distributed/dp/1608456838/)
