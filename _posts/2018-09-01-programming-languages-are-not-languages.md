---
layout: post
title: Programming Languages are not Languages
---
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@old_sound">
<meta name="twitter:creator" content="@old_sound">
<meta name="twitter:title" content="Programming Languages are not Languages">
<meta name="twitter:description" content="Does the language metaphor applies to programming languages?">
<meta name="twitter:image" content="http://alvaro-videla.com/images/programming_languages.png">

# {{page.title}}

<span class="meta">September 01 2018</span>

In my [previous article](TODO) I talked about how the metaphors used to present a problem, set the stage for how we are going to talk about the problem. They provide a framework for our thinking, on one side helping us solve it, and on another side they constraining the solutions we find.

I ended the article by saying that we are so used to call Programming Languages "languages" that we don't even stop for a second to think about the implications that are carried over (_metapherein_) when we liken them to natural languages.

Of course treating programming languages like natural languages, is very helpful. This allows us to reason about their syntax and their grammar rules, the semantics of certain expressions, and so on.

Recently I found some cases where from my point of view the PLT community was getting too carried away by the language metaphor that they abscribed some characteristics from natural languages to programming languages which I think don't apply 100% to them. As always happens with metaphors, one need to be careful when using them, because by definition they are not a 1 to 1 map from source domain to target domain.

In the article _[A Programmable Programming Language](https://cacm.acm.org/magazines/2018/3/225475-a-programmable-programming-language/fulltext)_ by Felleisen et al[4]. the authors said something that caught my attention with regards to how they talk about programming languages. Here's the section where they present what are the principles that guide Language Oriented Programming (the topic of their article).

In a very butchered way, we can say that despite the new name, LOP is like programming with embedded DSLs, but in this case they propose a language ([Racket](https://racket-lang.org/)) whose goal is to remove the friction between the eDSL and the host language (see their article for a full definition of LOP). I think LOP is a very interesting idea and thanks to this article I definitely want to try Racket.

They define one of the guidelines for LOP as: _**Turn extra-linguistic mechanisms into linguistic constructs**_, and they expand:

>A LOP programmer who resorts to extra-linguistic mechanisms effectively acknowledges that the chosen language lacks expressive power. The numerous external languages required to deal with Java projects - a configuration language, a project description language, and a makefile language-represent symptoms of this problem. We treat such gaps as challenges later in the article.

This is a very interesting point that brings to mind all these a-ha! moments that designers talk about, when they come up with a new idea that changes people's lives, where we think "this has always been this way, but I had no idea it could be better". After reading that paragraph I do wonder why a Java project (to stay in their example), is built with a variety of languages. Do we really need all those languages to build a software project?

On the other hand, after seeing what happened with Scala and [SBT](https://racket-lang.org/), where sometimes the project build description ends up written directly in Scala, I'm not sure having one language that encompasses all is something I'd want. Erlang suffered the same problem. RabbitMQ - as many other tools built in Erlang - exposed their configuration in Erlang. That was the source of many problems for people that tried to use RabbitMQ but that were foreign to Erlang. Is it worth to expose users to an alien configuration format, just so the developers of the project can program in just one language?

Also when they refer to "extra-linguistic mechanisms" do they mean different [codes](https://en.wikipedia.org/wiki/Code_%28semiotics%29) as in semiotics? In a [previous article](TODO) I talked how different codes are used in film. Think for example a movie that shows a sad protagonist, with rain in the background and how that blends with the background music and sometimes even the lyrics. There the different codes work together to augment the meaning conveyed by that scene. Also having different codes, can allow one community (music) to evolve independently from another one (film), so when they are used in communion later on, we get an even richer experience. The same could be said about build tools vs. programming tools, [but I digress](https://increment.com/documentation/notes-on-the-synthesis-of-labyrinths/)…

Back to the topic of this article, I wanted to see when the language metaphor doesn't hold. Let me bring back a sentence from the paragraph I cited above:

>A LOP programmer who resorts to extra-linguistic mechanisms effectively acknowledges that the chosen language lacks expressive power.

When they say expressive power the authors attach a footnote that reads:

>Like many programming-language researchers, we subscribe to a weak form of the Sapir-Whorf hypothesis

So what's the Sapir-Whorf hypothesis. This hypothesis is pretty popular in linguistics, because it became kind of an urban legend. Have you ever heard the semi-myth that [Eskimo languages have a large amount of words for the concept of snow](https://medium.com/r/?url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FEskimo_words_for_snow)? This is related to the Sapir-Whorf hypothesis or the [Linguistic Relativity](https://en.wikipedia.org/wiki/Linguistic_relativity) hypothesis. As you can see from the text cited above, the authors subscribe to a weak form of the hypothesis. So what are these two forms? Quoting Wikipedia:

- The strong version says that language determines thought and that linguistic categories limit and determine cognitive categories.
- The weak version says that linguistic categories and usage only influence thought and decisions.

The strong version is generally agreed to be false, while there's several experiments that show that our mother languages do shape the way we see the world, that is, the way we can categorize it. If you want to learn more about this hypothesis, I'd recommend reading the chapter My Language Limits My Thoughts, from the book _[Women Talk More than Men… and Other Myths about Language Explained](https://www.cambridge.org/core/books/women-talk-more-than-men/8532B2D22C70E5D3AEE4F9176AD29E7D)_[6].

So while I don't know what do the authors mean when they say "we subscribe to a weak form of the Sapir-Whorf hypothesis", I'm not sure this hypothesis applies to programming languages. Or in other words, this is stretching the language metaphor. Let's see why.

While the world is a _continuum_, we slice into tiny pieces, we _discretize_ it with words. We categorize the world and this categorization is expressed in the words from our language:

>Language makes experience orderly by creating discrete and stable objects out of a relatively undifferentiated sensory flux; these objects are internalized as concepts.[2]

And here's why I don't think the Sapir-Whorf hypothesis fully applies to programming languages. When we program we categorize the world in English (or Spanish, or any other natural language), and then we encode that into a program. So the programming language I'm using, is not limiting the way in which I see the world. As Umberto Eco says in _The Search for The Perfect Language_[3]:

>Computer languages like BASIC or Pascal, are, in fact, a priori languages. They are not full languages because their syntax, though rigorous, is simplified and limited, and they remain parasitic on the natural languages which attach meaning to their empty symbols […]

Is there another metaphor we could use to think about programming languages, besides languages. I think there is: tools. This was proposed by Kenneth Iverson in his 1979 Turing Award lecture: _**Notation as a Tool of Thought**_[5].

If we think of programming languages as tools, then it becomes evident how some programming languages lend themselves naturally to problems that in other languages might be - while not impossible - hard to solve. See for example Erlang, a language that's tailored for Concurrency Oriented and Message Passing programming, or Racket itself, a language tailored for LOP.

## Relative Linguistic Relativity ##

Above I said "I don't think the Sapir-Whorf hypothesis fully applies". Let's explain why I wrote "_fully applies_". Words help us categorize the world around us. They help us define concepts. The etymology of the word [define](https://www.etymonline.com/word/define#etymonline_v_914) is very interesting, because it brings forth the idea of "to bound, limit" (the word term also has a similar [etymology](https://www.etymonline.com/word/term#etymonline_v_10648)).

So if a language influences the way we define things, I can see how this manifest in how programmers with backgrounds in different language paradigms define the units in their code. To give an example: A `for loop`, something so common in imperative languages like Java or C, is usually abstracted away in functional programming languages with constructs like `map` and `fold`. A functional programmer looking at Java code, might see immediately that the `for loop` must be extracted into its own function. A Java programmer might wonder why a bunch of functions that are scattered across a file and seem to operate on the same data, aren't abstracted away into an class.

It would be interesting to see if this is in fact true: that different language paradigms influence what people determine as units in their code, for instance, when they decide to apply the [extract-method](https://refactoring.com/catalog/extractMethod.html) refactoring, to name one example. It's interesting to note that Forth calls these units "words", and the process of refactoring, simply [factoring](http://thinking-forth.sourceforge.net/)[1].

## Conclusion ##

Because metaphors are so commonplace in our day to day speaking, we lose track of when we are using them, which results in us framing problems in what perhaps could be a wrong setting, as explained in my previous [article](TODO).

If we want to think about what kind of problems a programming language makes easy to solve, and which ones they make more difficult, I'd say it's better to use the tool metaphor, and see where that framing could take us.

With regards to the Sapir-Whorf hypothesis, I think it might apply to programming languages if we think about what each language community most generally defines as a unit of code, i.e.: something that could be wrapped inside a function/method and thus be named, [and not passed over in silence](https://en.wikipedia.org/wiki/Ludwig_Wittgenstein).


---

## References: ##

1. Brodie, Leo. Thinking Forth. 2004. http://thinking-forth.sourceforge.net
2. Chandler, Daniel. Semiotics: The Basics, Third Edition. Routledge, 2017.
3. Eco, Umberto. The Search for the Perfect Language. Blackwell, 2006.
4. Felleisen, Matthias et al. A Programmable Programming Language. Communications of the ACM, March 2018, Vol. 61 №3, Pages 62–71.
5. Iverson, Kenneth. Notation as a Tool of Thought. Communications of the ACM, August 1980, Volume 23 Issue 8, Pages 444–465.
6. Kaplan, Abby. Women Talk More than Men… and Other Myths about Language Explained. Cambridge University Press, 2016



---

## Credits: ##

Image from the British Library Online Archive, from [Heron of Alexandria, Pneumatica, De automatis](http://www.bl.uk/manuscripts/Viewer.aspx?ref=burney_ms_108_f077r).