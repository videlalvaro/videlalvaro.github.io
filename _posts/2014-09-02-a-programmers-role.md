---
layout: post
title: "A Programmer's Role"
---

# {{page.title}} #

<span class="meta">September 02 2014</span>

The other day I found an article from 1967 that could easily be called
"Clean Code, 1967 edition". The article explains what separates bad
programmers from good ones, and bad programs from good ones.

One of the main themes of the article is how to make our programs so
that they survive the passage of time, _entropy_ as they called it
back then, or _code rot_ as textbooks call it today. So one of the
main features a program can have is its ability to adapt:

>A program is rarely killed by a failure of static stability. The
>death usually occurs because of a failure in the program's mechanisms
>for maintaining stability, in its abilities to respond to
>environmental change.

One of the main ways to achieve that is to work on making our programs
easier to understand for other programers, and for our future selves:

>Thus a programmer develops his program so that a human can comprehend
>it. Initially this is merely self-protective, as he must understand
>the program enough to get into production. It would appear that all
>good programmers attempt to do this, whether they recognize it or
>not.

The following quote is the typical one where I think, wow, why it
didn't occur to me to express this idea like that:

>Furthermore, no one has seen a program which the machine could not
>comprehend but which humans did.

The usual programmer doing _smart_ things that nobody else can
understand later comes immediately to mind. Programs should communicate
our intent, tell others about the problem we are trying to solve,
something that we could argue that is better done with languages that
encourage a more declarative style of programming.

## What a programmer does ##

For me and probably the people reading this blogpost, this all might
seem rather obvious, on the other hand, almost 50 years have passed
and the problem of building maintainable software still
exists. Countless languages have appeared, programming methodologies
and what not, but we still somehow fail. I think the author of this
article has a clear lead on how to address this problem:

>A programmer does not primarily write code; rather, he primarily
>writes to another programmer about his problem solution. The
>understanding of this fact is the final step in his maturation as
>technician.

We should program for other humans and forget about computers. If our
code is legally correct, the computer will for sure understand it.

>Both the value and quality of a programmer's work improve directly
>with the importance he places on communicating his program to a
>human, rather than merely to the machine.

Here's the link to the full article:
[What a Programmer Does](http://archive.computerhistory.org/resources/text/Knuth_Don_X4100/PDF_index/k-9-pdf/k-9-u2769-1-Baker-What-Programmer-Does.pdf)

NOTE: It's interesting to see that in those days, _the programmer_
was usually mentioned as _"he"_, even in papers/books written by women,
like Jean Sammet. Since I was quoting this article, I left the use of
the gendered pronoun as it was used those days.
