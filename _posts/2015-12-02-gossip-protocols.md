---
layout: post
title: "Gossip Protocols, Where to Start"
---

# {{page.title}} #

This week I started reading about Gossip Protocols, or _Epidemic
Protocols_ as they are sometimes called as well. It's quite an
interesting topic in distributed systems and as you might guess, once
you start investigating, the rabbit hole goes on and on.

Gossip protocols were initially used as a way to maintain consistency
on databases that were replicated at several hundreds sites. From then
on it was seen that the gossiping could be used to solve other
problems, like calculating averages across a network of nodes; or as a
way to build an overlay of nodes in a network. Maintaining node
membership is another problem that's been tackled with gossiping.

These protocols usually work like this:

- A node in the network randomly selects a peer with which it will
  exchange some information.
- A data exchange process happens between these peers.
- Each node processes the data it received.
- These steps are periodically repeated by the nodes in the network as
  a way to disseminate information.

These protocols work in a similar fashion as how a disease
disseminates in a population. Nodes are classified as being
_infective_, _susceptible_ and _removed_. An infective node will try
to spread some information by periodically selecting a random peer
from the network. If the peer is _susceptible_, that is, it doesn't
know about said information, then it will become infected, and thus
will also start to try to spread this particular information to other
nodes. A _removed_ node is one that knows about the new piece of
information that circulating around, but it's not spreading it (for
example if all the neighboring nodes already know the information,
there's no need to keep spreading it).

This can also be seen in the light of how rumour is spread. One person
_A_ first hears a rumour, then calls over the phone someone person _B_
in order to share the rumour. Once they hung the phone, _B_ calls a
third one, let's say _C_, while at the same time _A_ contacts _D_ to
share the rumour as well. The process continues on and on until
everyone learns about the rumour. As you can see, this technique can
be used to spread data pretty fast among a network of processes.

The analysis of these algorithms focuses on designing strategies on
how to best select the peer to share information with. For this
problem, there are mathematical models that prove that using this or
that peer selection technique, the state of the system will converge
in this or that direction after M rounds. In these systems, information
is usually spread in O(log(N)) steps, where N is the number of peers
in the network.

If you want to get started with this topic, here I recommend some
papers that are quite fundamental when it comes to understanding how
gossiping works:

- [Epidemic Algorithms For Replicated Database Maintenance](https://www.cis.upenn.edu/~bcpierce/courses/dd/papers/demers-epidemic.pdf):

This paper by Alan Demers et al. is considered to be the seminal paper
that introduced gossiping/epidemic algorithms in our industry. It's a
very interesting read that also shows the problems they were trying to
solve in distributed systems back in the '80s.

- [Gossiping in Distributed Systems](http://www.distributed-systems.net/papers/2007.osr.pdf)

This paper by Anne-Marie Kermarrec and Maarten van Steen tries to give
an overview and build a framework that would help us better understand
and analyse gossiping protocols. Highly recommended as a kind of
"foundations" reading.

- [The promise, and limitations, of gossip protocols](http://dl.acm.org/citation.cfm?id=1317382)

Before drinking the Gossiping Kool Aid, it's recommended to read this
paper by Ken Birman, in which he describes some of the limitations of
gossip protocols.

I hope you find this topic interesting and that these papers server
you as a base to get you started.
