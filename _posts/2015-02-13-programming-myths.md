---
layout: post
title: "Harmful GOTOs, Premature Optimizations, and Programming Myths are the Root of all Evil"
---
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@old_sound">
<meta name="twitter:creator" content="@old_sound">
<meta name="twitter:title" content="Programming Mythds Considered Harmful">
<meta name="twitter:description" content="Let's revisit some programming myths and see how harmful they have been to our industry.">
<meta name="twitter:image" content="http://videlalvaro.github.io/images/fork-join-tree.png">

# {{page.title}} #

What follows is the presentation I gave in the inaugural meeting of
Papers We Love Madrid. The subject of the talk was the paper
Structured Programming with Go To Statements by Donald Knuth.

<script async class="speakerdeck-embed" data-id="3ab49362d8434ad29937726e29a1533d" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

>The biggest problem we have as human beings is that we confuse our
beliefs with reality" - Alan Kay.

>The question is whether we should ban it [GOTO], or educate against
 it. –– Donald Knuth

In this article I would like to talk about myths. Google defines
_myth_ as "a widely held but false belief or idea", while
dictionary.com tell us: "an unproved or false collective belief that
is used to justify a social institution". The question is, do we, XXI
century people believe in myths?

Umberto Eco on The Book of Legendary Lands proposes a simple exercise
to show us how widespread some myths are in our societies, so far in
fact that sometimes we don't even realize we are talking about things
that are not true. He proposed to ask a person what it was that
Christopher Columbus tried to demonstrate when he wanted to reach the
Indies by traveling west, and what was the common held belief at the
time by the doctors of Salamanca. Many people will answer that
Columbus wanted to prove that the Earth was round, opposing the common
held belief that
[the Earth was flat](http://en.wikipedia.org/wiki/Myth_of_the_Flat_Earth). The
thing is, as Eco demonstrates in his book, people in the Middle Ages
knew all too well that the Earth wasn't flat. There were even
calculations about the actual diameter of the Earth to see how long
Columbus would have to travel to reach the Indies. The real reason the
establishment opposed Columbus' plans was in fact based on this
knowledge: they were concerned it would demand too many resources
because of the distance.

How did such a myth become so widespread? There's a book called
_[A History of the Life and Voyages of Christopher Columbus](https://archive.org/details/ahistorylifeand08irvigoog)_
by Washington Irving, who, while trying to document Columbus' life,
also added some _spice_ to the story in order improve the entertaining
qualities of his work. At the same time as Irving’s book was making
the rounds, science was trying to bring forth the Theory of Evolution
as opposed to Creationism. If the Church Fathers were wrong about the
shape of the Earth, perhaps these secular thinkers from the XIX
century could show as well how the Church was wrong about
Creationism. They unearthed the theories of a certain Lactantius and
also Cosmas Indicopleustes who claimed back in the 3rd century that
the Earth was flat. So we have on one side a writer trying to improve
the story on his book by adding some _facts_ here and there, and some
secular thinkers trying to bring forth the Theory of Evolution, giving
birth, or adding fuel, to the myth of the flat Earth.

[![A History of the Life and Voyages of Christopher Columbus](/images/myths/Life_and_Voyages_of_Columbus.jpg)](http://en.wikipedia.org/wiki/A_History_of_the_Life_and_Voyages_of_Christopher_Columbus)

We have a case of a widespread myth that despite facts to the
contrary, still survives. A myth propagated by people whose intentions
were to bring _reason_ forward. It looks like a case of the _end
justifies the means_. It's interesting to see how some pseudo-fact get
published on a book, and then scholars just repeat that fact without
checking its veracity, until it snowballs into the present. It is most
probable that the _Myth of the Flat Earth_ doesn't affect us at all
today, after more than four hundred years have passed since Columbus
voyages, but the question is, what about our field, computer
science. Do we have similar cases in Software Engineering? Myths that
persist in present days, but for which we don’t even know the origin
or the context in which they were initially created, and whose truth
we actually ignore? I think we do, but more in the shape of certain
_maxims_ that we all should follow no matter what. Which brings us to
the paper I would like to discuss today,
[Structured Programming with Go To Statements](http://dl.acm.org/citation.cfm?id=356640&dl=ACM&coll=DL)
by Donald Knuth.

![Structured Programming with Go To Statements](/images/myths/structured_programming_with_goto_statements.png)

How did I get interested in this paper? It all started with a simple
question posted as a
[Github issue](https://github.com/igorw/retry/issues/3) for a PHP
library. The question is as follows:

>May I ask if there is a reason why you prefer using goto instead of
 function recursion?

The user was referring to the goto statement that appears on line 17
of the following program:

{% highlight php %}
<?php

namespace igorw;

class FailingTooHardException extends \Exception {}

function retry($retries, callable $fn)
{
    beginning:
    try {
        return $fn();
    } catch (\Exception $e) {
        if (!$retries) {
            throw new FailingTooHardException('', 0, $e);
        }
        $retries--;
        goto beginning;
    }
}
{% endhighlight %}

The author of the library proceeded to give a
[deep explanation of how the PHP interpreter works](https://github.com/igorw/retry/issues/3#issuecomment-56448334),
giving the reasons why he favored the use of GOTO instead of recursion
as suggested by the user. Of course, this being the internet, a
flamewar was just about to start. One user not only was against the
use of a GOTO statement, but he also linked to the famous paper by
Dijkstra
[Go To Statement Considered Harmful](https://www.cs.utexas.edu/users/EWD/ewd02xx/EWD215.PDF). Seeing
so many different opinions on the issue, I wanted to know more.

![flamewar dot gif](/images/myths/flamewar.gif)

A simple Google search lead me to the Stack Overflow discussion called
[GOTO still considered harmful?](http://stackoverflow.com/questions/46586/goto-still-considered-harmful)
which in turn contrasts Dijkstra's paper with the one by Donald Knuth,
which I have already mentioned, and which is the main subject of this
talk.

Dijkstra's paper advocates for the removal of GOTO statements, since
they make understanding programs that use them difficult. It's
interesting to note some of the story around that paper. Dijkstra had
submitted it as
[A case against the goto statement](http://www.cs.utexas.edu/~EWD/transcriptions/EWD13xx/EWD1308.html),
but in order to speed up its publication, the editor published it
under "letters to the editor" with the new, _more interesting_,
title. The editor was Niklaus Wirth, creator of Pascal.

![A Case against the Go To Statement](/images/myths/a_case_against_goto.png)

It seems the paper created a lot of agitation at the time, not only
against people that were misusing GOTO but also against people that
were writing well structured programs, but which happened to use
GOTOs. These people were offended because now they were also treated
as bad programmers.

Before finding Knuth's _Structured Programming with Go To Statements_
paper, I had the idea that Columbus was trying to prove that the Earth
was flat, which is to say, that Dijkstra was against all uses of the
GOTO statement. A few paragraphs into Knuth's paper and we start
finding some gems from private communications between Knuth and
Dijkstra. According to Knuth, Dijkstra wrote:

>Please don't fall into the trap of believing that I am terribly
 dogmatical about [the go to statement]. I have the uncomfortable
 feeling that others are making a religion out of it, as if the
 conceptual problems of programming could be solved by a single trick,
 by a simple form of coding discipline!

Interesting choice of words, of which I would like to underline
_religion_ and _single trick_. For some reason we developers are
always in search of Silver Bullets, looking for Holy Grails that will
solve all our problems. For example, more often than not we see blog
posts by people claiming to have
[beaten the CAP Theorem](http://ferd.ca/beating-the-cap-theorem-checklist.html). A
mathematical theorem… beaten; but in software development silver
bullets don't exist, as Frederick Brooks Jr. discusses on his paper
called
[No Silver Bullet](http://worrydream.com/refs/Brooks-NoSilverBullet.pdf).

>There is no single development, in either technology or management
 technique, which by itself promises even one order of magnitude
 [tenfold] improvement within a decade in productivity, in
 reliability, in simplicity.

Despite all evidence, we still are in the look for the magical formula
that will save us from ourselves.

Back to the paper. After the intro to his paper, Knuth starts to do an
exhaustive historical revision of who has opposed GOTOs in the history
of programming, mentioning that this goes back as afar as 1959.

Then the paper starts the first of its main sections: "Elimination of
go to statements". Here Knuth presents a variety of algorithms that
involve either for loops, or while loops that use GOTO statements here
and there and then Knuth proceed to discuss how to remove them. What's
interesting here besides the programs themselves, is that they are made
only of the most basic program constructs, like `for` and `while`,
there are no procedures for example, let alone classes. So I started
to wonder, in what era of programming are we in while we read this
paper?

The paper was published in 1974. Here's the second code snippet,
called _Example 1a_:

![Example 1a](/images/myths/example_1a_knuth.png)

What's interesting about this is not the algorithm per se, but what
follows:

>The **and** operation used here stands for McCarthy's sequential
 conjunction operation.

So in this paper Knuth has to stop and explain what is the `AND`
[short-circuit operator](http://en.wikipedia.org/wiki/Short-circuit_evaluation)
that today we take for granted in most programming languages. Let's
take a diversion for a moment and see what was going on in the
computing circles of the time this paper was published.

I've mention already that the examples in the paper are about basic
programming constructs, like `if`, `for` and `while`. This is 1974 and
Barbara Liskov just published her seminal paper on
[Programming with Abstract Data Types](http://dl.acm.org/citation.cfm?id=807045&dl=ACM&coll=DL). In
a recent talk at
[InfoQ](http://www.infoq.com/presentations/programming-abstraction-liskov),
Liskov said that procedures were the way of doing abstraction, people
didn’t even know what modules were.


![Programming with Abstract Data Types](/images/myths/abstract_data_types_liskov.png)

Logic Programming is just starting to be a
_thing_. [PLANNER](http://dspace.mit.edu/handle/1721.1/6171) was
designed in 1969 and in Europe we get
[Prolog](http://dl.acm.org/citation.cfm?doid=155360.155362) in 1972.

![The Birth of Prolog](/images/myths/the_birth_of_prolog.png)

Back in 1964
[BASIC](http://web.archive.org/web/20120716185629/http://www.bitsavers.org/pdf/dartmouth/BASIC_Oct64.pdf)
was created, and in 1968 we get ALGOL, the language that introduced
`begin` and `end` as block delimiters.

![BASIC](/images/myths/basic.png)

In 1973, UNIX is released to the public, the same year
[Ethernet](http://www.computerhistory.org/timeline/?year=1973) was
created. Also the
[ACTOR model](http://worrydream.com/refs/Hewitt-ActorModel.pdf) was
developed by Carl Hewitt.

![Ethernet](/images/myths/ethernet.png)

Another characteristic of Knuth's paper is that it has the old way of
calculating the complexity of an algorithm by counting its
operations. It will take until 1976 for Knuth to introduce
[Big O notation](http://www.phil.uu.nl/datastructuren/10-11/knuth_big_omicron.pdf)
into the programming circles as a way of analyzing algorithm
complexity, a concept that was part of mathematics since 1894. To
bring some more context, 1976 is the same year the Apple I was
released.

![Big Omicron Knuth](/images/myths/big_omicron_knuth.png)

[![Big Oh Notation in Die analytische Zahlentheorie](/images/myths/big_o_notation.png)](https://archive.org/stream/dieanalytischeza00bachuoft#page/400/mode/2up)

On the security side we have that in 1977 the
[RSA algorithm](http://www.google.com/patents/US4405829) was presented
to the public.

![RSA Original Scheme](/images/myths/rsa_patent_scheme.png)

Next year, in 1978 Robin Milner publishes
[A Theory of Type Polymorphism in Programming](https://courses.engr.illinois.edu/cs421/sp2013/project/milner-polymorphism.pdf). In
the same year Leslie Lamport publishes the seminal paper on
distributed systems called
[Time, Clocks, and the Ordering of Events in a Distributed System](http://web.stanford.edu/class/cs240/readings/lamport.pdf)

![RSA Original Scheme](/images/myths/type_polymorphism_milner.png)

So we have a time where personal computers were far from becoming
common place, where public-key encryption as we know it today was
about to appear, and where programming techniques in common use today,
like the use of Abstract Data Types were just starting to be discussed
in academia. Having that in mind we can see why the examples in
Knuth's paper are all about how to improve loops that use for
statements or GOTOs; or why Knuth has to explain what `AND` means
inside an `if` clause.

In this context of scarce computer resources we find why Knuth is
interested about extracting the maximum performance out of his
programs. He writes that "most of the running time in non-IO-bound
programs is concentrated in about 3% of the source text", that there's
always an "inner-loop" which if we speed it up by 10% then everything
gets the same gains.

The problem for Knuth is that programmers spend time trying to speed
up the wrong parts of the program, as he said in his turing award
lecture,
[Computer Programming as an Art](http://dl.acm.org/citation.cfm?id=361612):

>Experience indicates that nearly everybody has the wrong idea about
 the real bottlenecks in his programs

So for him, "we should forget about small efficiencies, say about 97%
of the time" and continues with the famous quote:

>premature optimization is the root of all evil

That last sentence has been quoted most of the time out of context,
creating a myth on its own, a complete religion on what to do and what
not to do with regards to program optimization. Is like the
[Godwin Law](http://en.wikipedia.org/wiki/Godwin's_law) of
optimization discussions. The problem is we usually omit what comes
next in the paper:

>Yet we should not pass up our opportunities in that critical 3%. A
 good programmer will not be lulled into complacency by such
 reasoning, he will be wise to look carefully at the critical code;
 but only after that code has been identified

The key words on that sentence being "only after that code
[the critical one] has been identified"; and then Knuth reminds us:

>the universal experience of programmers who have been using
 measurement tools has been that their intuitive guesses fail.

It's clear that Knuth is not forbidding us from performing
optimizations, we shall do them, but only when we know they are going
to help, and of course the only way of knowing is measuring, running
benchmarks on our programs.

The problem with the _root of all evil_ quote being cited out of
context is that it seems to be used to forbid all kind of
optimizations, like a sword of Damocles preventing us from even trying
to improve some code.

As the paper progresses Knuth keeps showing us examples of program
where GOTOs can be removed, but all the while the resulting program
keeps having the same or very similar performance characteristics as
the original one. At the same time, readability and the
understandability of the program are key factors for Knuth when
deciding to refactor the program one way or another. One might wonder
why Knuth is so concerned with the efficiency of his programs. Of
course he has the answer:

>My books emphasize efficiency because they deal with algorithms that
 are used repeatedly as building blocks in a large variety of
 applications

This can help us put into context the information we are receiving
from this paper. If we think about it, perhaps most of the basic
algorithms in use today have been influenced one way or another by
what Knuth wrote on his TAOCP book.

Later in the paper Knuth writes:

>We shouldn't merely remove go to statements because it's the
 fashionable thing to do; the presence or absence of go to statements
 is not really the issue.

"The biggest problem we have as human beings is that we confuse our
beliefs with reality" - Alan
Kay. [Programming and Scaling](http://www.tele-task.de/archive/video/html5/14029/)

I've presented only two cases of sentences or even paper titles that
have out grown their surroundings to become greater than the papers
where they were originally published, but I think they are enough as
examples of
[myths that we carry with us](http://en.wikipedia.org/wiki/Cargo_cult_programming).

On an [interview](https://queue.acm.org/detail.cfm?id=1039523), Alan
Kay discussed why he think some languages with arguably more technical
merits than others go unnoticed, while some other programming
languages become more popular. He understand that we have a problem
with education, with our own education as programmers:

>[in the 70s] computing spread out much, much faster than educating
 unsophisticated people can happen

He said that this created a sort of pop-culture of programming where
we started ignoring the fundamentals of our discipline. He adds:

>So I think the lack of a real computer science today, and the lack of
 real software engineering today, is partly due to this pop culture.

And this brings us to two phenomena of today's programming culture:
Twitter and Hacker News. Discussions that happen in those websites
would lead us to believe that people is forming opinions based in
[just reading the story titles](https://news.ycombinator.com/item?id=5473558). We
live in such [clickbait](http://en.wikipedia.org/wiki/Clickbait)
times, than there are even
[Twitter accounts](http://www.vice.com/read/this-guy-hates-click-baity-headlines-heres-why)
whose only purpose is to dismantle those baits.

Once I joked that if a "thought doesn't fit in 140 characters, then
it's not a thought worth having", to which a colleague responded: did
you know there's a conference for computer science research whose
papers fit in 140 characters or less? Yep, here it is:

[![Tiny TOCS](/images/myths/tiny_tocs.png)](http://tinytocs.org/).

I think this trend is taking us away from computer science. We no
longer know what happened in the past. We reinvent methodologies and
give them new names: [Agile](http://thinking-forth.sourceforge.net),
[TDD](https://arialdomartini.wordpress.com/2012/07/20/you-wont-believe-how-old-tdd-is/),
[offline-first](http://www.isi.edu/~johnh/RESEARCH/ucla/#ficus_replication),
to name a few.

Dijkstra
[knew](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD13xx/EWD1308.html)
all too well about this problem:

>In 1968, the Communications of the ACM published a text of mine under
 the title "The goto statement considered harmful", which in later
 years would be most frequently referenced, regrettably, however,
 often by authors who had seen no more of it than its title

His paper more than anything has been "godwin-lawed" at innumerable
discussions, often by just naming its title, ignoring completely the
context, or the remarks made afterwards about it by Dijkstra himself.

This treatment of knowledge reminds me of a paragraph from Fahrenheit
451, when the chief fireman explains to Mr. Montag what was the reason
why they banned books:

>Classics cut to fit fifteen-minute radio shows, then cut again to
 fill a two-minute book column, winding up at last as a ten- or
 twelve-line dictionary resume.

Why is it that we prefer to spread only these _digests_ of great
papers and ideas from the past, to form these myths? I believe there's
a simple answer and a more complex, related one. The simple answer has
to do with laziness and the need to appear smart. On an agitated
discussions is better to drop a paper title than to be beaten by other
people's arguments. Of course I'm being sarcastic.

I believe the more complex answer is related to memes as explained by
Richard Dawkins on his book
[The Selfish Gene](http://en.wikipedia.org/wiki/The_Selfish_Gene). All
these one-sentence programming maxims are easy to repeat and to
follow, than to actually learning the whole methodology. As Knuth says
on his paper:

>[…] there has been far too much emphasis on go to elimination instead
 of on the really important issues; people have a natural tendency to
 set up all easily understood quantitative goal like the abolition of
 jumps, instead of working directly for a qualitative goal like good
 program structure

It's easier to count lines of code produced by an programmer that the
actual quality of the work they produce.

At the end of the day we should focus on what matters, we should
internalize that we are always making choices between different kind
of tradeoffs, but in our case, programs that are easier to understand
should triumph over complicated ones:

>we should strive most of all for a program that is easy to understand
 and almost sure to work

Finally with regards to our own discipline, let's close by reminding
us of Dijkstra's words:

"we had better see to it that the computer industry does not kill
computing science" from Dijkstra on
[Computing Science: Achievements and Challenges](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD12xx/EWD1284.html)

## Acknowledgments: ##

I would like to thank [Miguel Pastor](https://twitter.com/miguelinlas3) and [Félix López](https://twitter.com/flopezluis) for inviting me to
present at
[Papers We Love Madrid](http://www.meetup.com/Papers-We-Love-Madrid/).

At the same time I would like to thank [Leif Walsh](https://twitter.com/leifwalsh) for helping me by
proof reading an early draft of this article. I have to add that
whatever errors or typos that remain in this paper are entirely my
fault.

## Resources: ##

- [Myth of the Flat Earth](http://en.wikipedia.org/wiki/Myth_of_the_Flat_Earth)
- [A History of the Life and Voyages of Christopher Columbus](https://archive.org/details/ahistorylifeand08irvigoog)
- [Structured Programming with Go To Statements](http://dl.acm.org/citation.cfm?id=356640)
- [Retry library, GOTO Usage](https://github.com/igorw/retry/issues/3)
- [Explanation of how the PHP compiler works](https://github.com/igorw/retry/issues/3#issuecomment-56448334)
- [Go To Statement Considered Harmful](https://www.cs.utexas.edu/users/EWD/ewd02xx/EWD215.PDF)
- [GOTO still considered harmful?](http://stackoverflow.com/questions/46586/goto-still-considered-harmful)
- [A Case against the Go To Statement](http://www.cs.utexas.edu/~EWD/transcriptions/EWD13xx/EWD1308.html)
- [Beating the CAP Theorem](http://ferd.ca/beating-the-cap-theorem-checklist.html)
- [No Silver Bullet](http://worrydream.com/refs/Brooks-NoSilverBullet.pdf)
- [Short-Circuit Operator](http://en.wikipedia.org/wiki/Short-circuit_evaluation)
- [Programming with Abstract Data Types](http://dl.acm.org/citation.cfm?id=807045&dl=ACM&coll=DL)
- [The Power of Abstraction, B. Liskov InfoQ Keynote](http://www.infoq.com/presentations/programming-abstraction-liskov)
- [PLANNER: A Language for Manipulating Models and Proving Theorems in a Robot](http://dspace.mit.edu/handle/1721.1/6171)
- [The birth of Prolog](http://dl.acm.org/citation.cfm?doid=155360.155362)
- [BASIC](http://web.archive.org/web/20120716185629/http://www.bitsavers.org/pdf/dartmouth/BASIC_Oct64.pdf)
- [Ethernet: Distributed Packet Switching for Local Computer Networks](http://research.microsoft.com/en-us/um/people/pcosta/cn_slides/metcalfe76ethernet.pdf)
- [A Universal Modular ACTOR Formalism for Artificial Intelligence](http://worrydream.com/refs/Hewitt-ActorModel.pdf)
- [BIG OMICRON AND BIG OMEGA AND BIG THETA](http://www.phil.uu.nl/datastructuren/10-11/knuth_big_omicron.pdf)
- [Die analytische Zahlentheorie](https://archive.org/stream/dieanalytischeza00bachuoft#page/400/mode/2up)
- [RSA Algorithm Patent](http://www.google.com/patents/US4405829)
- [A Theory of Type Polymorphism in Programming](https://courses.engr.illinois.edu/cs421/sp2013/project/milner-polymorphism.pdf)
- [Time, Clocks, and the Ordering of Events in a Distributed System](http://web.stanford.edu/class/cs240/readings/lamport.pdf)
- [Computer Programming as an Art](http://dl.acm.org/citation.cfm?id=361612)
- [Godwin Law](http://en.wikipedia.org/wiki/Godwin's_law)
- [Programming and Scaling, Talk by Alan Kay](http://www.tele-task.de/archive/video/html5/14029/)
- [Cargo Cult Programming](http://en.wikipedia.org/wiki/Cargo_cult_programming)
- [A Conversation with Alan Kay](https://queue.acm.org/detail.cfm?id=1039523)
- [HN just reading the story titles](https://news.ycombinator.com/item?id=5473558)
- [Clickbait](http://en.wikipedia.org/wiki/Clickbait)
- [Saved You A Click](http://www.vice.com/read/this-guy-hates-click-baity-headlines-heres-why)
- [Tiny ToCS](http://tinytocs.org/)
- [Thinking Forth](http://thinking-forth.sourceforge.net)
- [You Won't Believe How Old TDD Is](https://arialdomartini.wordpress.com/2012/07/20/you-wont-believe-how-old-tdd-is/)
- [Ficus Replication](http://www.isi.edu/~johnh/RESEARCH/ucla/#ficus_replication)
- [What led to "Notes on Structured Programming"](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD13xx/EWD1308.html)
- [The Selfish Gene](http://en.wikipedia.org/wiki/The_Selfish_Gene)
- [Computing Science: Achievements and Challenges](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD12xx/EWD1284.html)