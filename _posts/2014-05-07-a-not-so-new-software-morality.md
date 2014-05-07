---
layout: post
title: A Not So New Software Morality
---

# {{page.title}} #

<span class="meta">May 07 2014</span>

Now that we all know TDD is dead, is time to perform some archeology,
to understand from where it came from. A good place to do that is the
book
[Software Testing Techniques](http://www.amazon.com/Software-Testing-Techniques-2nd-Edition/dp/1850328803)
by Boris Beizer. Originally written in 1983, there's a "new" edition
from 1990 that can be purchased form Amazon. The book covers Unit
Testing as well as Integration Testing, among other techniques. What
caught my attention today is some section near the end of the book
where he presents __A New Software Morality__.

What is interesting is how similar this is to what today we consider
as part of _agile_ or _xp_ or _methodology in vogue_. Here it is in
full:

## A New Software Morality ##

>Good software works, meets requirements, is robust, and is easy to
>understand, easy to integrate, and easy to test. Furthermore, it
>keeps these qualities over a long period of time because it is a
>permanent product rather than a transitory one. Software quality has
>almost nothing to do with algorithmic elegance, compactness, or
>speed—in fact, those attributes do more harm to quality than
>good. Good algorithms, compactness, and speed do matter for a small
>part of software—such a small part of software that I can safely
>discount these attributes as having anything to do with quality. Most
>programmers will never find themselves in a situation where they
>matter. Unfortunately, most programmers have been led to believe,
>because of their early training, hacker folklore, and hero myths that
>led them into programming, their early experiences with toy programs,
>that “good” means elegant, compact, and fast. Here’s a software
>morality update.

It's quite interesting how he contrasts the _hacker_ mentality vs. the
_software-engineer-you-are-part-of-a-bigger-project_ mentality.

Then he goes one and gives a list of six points that makes this new 
"morality":

>1.  Test —If you can’t test it, don’t build it. If you don’t test it,
>rip it out.

I can almost read this previous paragraph with the voice of my friend
[Chris Hartjes](https://twitter.com/grmpyprogrammer), Mr. Grumpy
Testing.

>2.  Put Testing Up Front —You can’t achieve testability if it’s an
>after-thought that follows design and coding. Tests are as important
>as code because code is garbage unless it is tested.

TDD anyone?

>3.  Don’t Be a Functional Overachiever —If it isn’t called for, don’t
>build it. There’s no requirement, therefore no specification,
>therefore no test criteria, therefore you can’t test it. And if you
>do “test” it, who’ll understand?

For the young people in the audience, you might have heard about this
previous concept being referred as YAGNI.

>4.  Don’t Put in Private Hooks —Hooks for future enhancements and
>functionality are architectural issues. Your hooks won’t be
>consistent with someone else’s hooks so they won’t be used in the
>future unless you happen to be the project leader. You can’t test the
>private hooks because there’s no supporting data structures or
>corequisite components. See rule 1.

>5.  Decouple —Don’t take advantage of hardware peculiarities,
>operating system quirks, the compiler, residues left by other
>components, physical anything, data structure details, environment,
>processing done by other components. Do what you can to reduce the
>dependency of your component’s proper behavior on the proper behavior
>or the invariant behavior of other components. Always ask yourself
>what will happen if the other component is changed. And if coupling
>is essential, document the potential vulnerability of your component
>to the continued good graces of the other component.

This last one particularly must be printed and sticked to every Scrum
board out there:

>6.  Don’t Squeeze —Don’t squeeze space, time, or schedule. Don’t
>allow shortsighted bosses concerned with next week’s progress report
>or the quarterly stockholders’ report to squeeze them for you. If you
>can’t fight them, document your objections and the expected
>consequences and/or vote with your feet.

At this point I'd like to imagine that
[Boris Beizer](http://en.wikipedia.org/wiki/Boris_Beizer) dropped the
mic and walked out of stage.
