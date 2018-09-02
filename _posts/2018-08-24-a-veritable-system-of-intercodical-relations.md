---
layout: post
title: A Veritable System of Intercodical Relations
---
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@old_sound">
<meta name="twitter:creator" content="@old_sound">
<meta name="twitter:title" content="A Veritable System of Intercodical Relations">
<meta name="twitter:description" content="How humans interpret the interplay between different codes to create meaning.">
<meta name="twitter:image" content="http://alvaro-videla.com/images/kimmy/01.png">

# {{page.title}}

<span class="meta">August 24 2018</span>

In the episode [“Kimmy Goes on a Playdate!”](https://en.wikipedia.org/wiki/List_of_Unbreakable_Kimmy_Schmidt_episodes#Season_2_%282016%29) from Netflix’s TV Series _**Unbreakable Kimmy Schmidt**_, there’s a couple of interesting bits that can lead us to reflect on how we humans learn about interpreting codes, and thus we can extract meaning from text in different contexts.

Understanding when context changes the meaning of a text is a task at which we humans seem to be pretty good at, but I wonder if “Machine Learning”, would be able to learn contextualization of text in a similar fashion (the definition of ML is left as an exercise for the reader), but this is a question for a different article.

## Breaking Kimmy Schmidt Apart ##

If you are unfamiliar with the show, here’s all you need to know to follow along: **Kimmy Schmidt** lives in New York after escaping a doomsday cult from _**Reverend Richard Wayne Gary Wayne**_. She works for _**Jacqueline Voorhees**_ where among many things, she takes care of Jacqueline’s step daughter _**Xanthippe**_. This is as much context as you need to understand what follows.

## Codes in Action ##

In episode two of the second season, Kimmy is about to destroy Xanthippe’s lifestyle by making her go back to her previous life with her real mother. Xanthippe gets angry and tell’s Kimmy how bad she is, which makes Kimmy reflect and realize that she’s behaving exactly like the reverend by ruining someone else’s life.

![alt text](/images/kimmy/01.png "Kimmy realizes she’s like the reverend — Unbreakable Kimmy Schmidt — Season 2, Episode 2.")

In denial, Kimmy then thinks that she’s not like the reverend:

![alt text](/images/kimmy/02.png "Kimmy is in denial — Unbreakable Kimmy Schmidt — Season 2, Episode 2.")

But here is where the interesting thing happens: when the frame changes as the camera follows Kimmy we see a wall picture with the text “YES YOU ARE”.

![alt text](/images/kimmy/03.png "'Yes You Are' wall picture — Unbreakable Kimmy Schmidt — Season 2, Episode 2.")

Despite nothing being explicitly uttered at this point in the episode, what mechanisms are in place that let us understand that the text in that wall picture is relevant to what’s happening in the scene? (Besides the obvious question: are non English speakers watching this show able to understand the implications of that wall picture?)

Later in the episode the same wall picture appears, but this time even though it has the same text written on it, the text is completely irrelevant. So how do we know that in this instance we must ignore the text in the wall picture?

![alt text](/images/kimmy/04.png "Wall picture in the background — Unbreakable Kimmy Schmidt — Season 2, Episode 2.")

In his introduction to Literary Theory, Terry Eagleton asks the following question: _What is involved in the act of reading_?

While this seems a rather simple question, think about a sign at the London Tube saying: “_Dogs must be carried on escalator_”. How do we understand that this particular sign doesn’t many any of what follows:

* You must carry a dog in the escalator
* You are going to be banned from the escalator unless you find a stray dog to carry.
* “Carried” is to be taken metaphorically and help dogs get through life
* How do I know this is not a decoration.
* I need to understand that the sign has been placed there by some authority Conventions: I understand that “escalator” means this escalator and not some escalator in Paraguay.
* “Must be” means must be now.

Eagleton writes:

>To read at all, we need to be familiar with the literary techniques and conventions which a particular work deploys; we must have some grasp of its ‘codes’, by which is meant the rules which systematically govern the way it produces its meanings.

What are these codes? In his book about Semiotics, Daniel Chandler says:

>Codes organize signs into meaningful systems […] Since the (intended) meaning of a sign depends on the code which it is situated, codes provide a framework within which signs make sense.

Think about a traffic light. If we are not familiar with their code, we cannot understand that a red light means ‘Stop!’, explains Chandler.

When we watch a TV Show we are familiar with the various codes that play together so we understand the film at several levels. Think of the typical movie scene when a person is missing the love of their life: we might have rain falling over the protagonist, sad music sounding in the background. In this case visual codes, like the rain, are mixed with music, which involve a total different code. We are able to place them together and augment the meaning we extract from the scene.

>We read meaning into texts, drawing upon our existing knowledge and experience of signs, referents, and codes in order to make explicit what is only implicit.

## What about programming? ##

Is any of this semiotic babble somehow related to programming? We can ask ourselves what mechanisms do we put in place when we understand code? Consider this Java class:

```
package com.example.store.user;
/**
 * Implements a user for our store.
 */
public class User {
    private String name;
    
    public User(String name) {
        this.name = name;
    }
    
    public String getName() {
        return this.name;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (!(obj instanceof User))
            return false;
        if (obj == this)
            return true;
        return this.getName() == ((User) obj).getName();
    }
}
```

This program is a bit under 30 lines of code. There we use the word user as a package name, a class name, it’s part of a comment in English, and it’s used for type casting inside the equals method.

To understand this program we need an understanding of the codes implicit in Java, to see that despite the word being the same in all those instances, its meaning is different. Also we mix codes, in this case when we have English comments with it’s own rules and syntax, mixed with those of Java.

A mixture of codes happens in a more evident way in frameworks like React with its language JSX that mixes XML style templating with Javascript. While on a first impression React might seem to be mixing concerns by not separating presentation code from its logic, what is happening is that these intercodical relations between XML and Javascript cooperate to augment the information provided by a component created with React.

When we understand a piece of programming code, we activate a series of mechanisms that help us remove ambiguity so we know what each word is trying to convey. In a program, we want to limit the possibles interpretation of the text, because we need to reason about the correctness of the program. Limiting the possible interpretation of a text requires the help of many devices that would guide its reading.

In Java the keyword `class` tells that what comes is the name of the class, while something like `instanceof` will tell us that we want to use the class name for type checking. A package name provide more clues about the purpose of the class, and so do comments.

As Eagleton says:

>[…] adopting a reading convention which eradicates ambiguity, itself depends upon a whole network of social knowledge.

Understanding the mechanisms that we humans use for reading texts, can help us recognize areas where we could improve our programs helping others adopt the right reading conventions for the code we wrote.

## References: ##

1. Chandler, Daniel. Semiotics: The Basics, Third Edition. Routledge, 2017.
2. Eagleton, Terry. Literary Theory: an Introduction. Blackwell Publishing, 2015.

## Credits: ##

* The title of this blogpost is a reference to a quote from film theorist [Christian Metz](https://en.wikipedia.org/wiki/Christian_Metz_%28critic%29). See Chandler’s book for more details.
* All screenshots were taken from Netflix’s TV Show Unbreakable Kimmy Schmidt