---
layout: post
title: Programming Languages are not Languages
---
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@old_sound">
<meta name="twitter:creator" content="@old_sound">
<meta name="twitter:title" content="The Power of Generative Metaphor">
<meta name="twitter:description" content="How metaphors condition problem setting.">
<meta name="twitter:image" content="http://alvaro-videla.com/images/generative_metaphor.jpeg">

# {{page.title}}

<span class="meta">August 31 2018</span>

![alt text](/images/generative_metaphor.jpeg)

In _Generative Metaphor: A Perspective on Problem-Setting in Social Policy_ Donald A. Schön presents the idea of how metaphors are central to the task of setting the frame in which we are going to make sense of a problem[1].

According to Schön, the metaphor used to present a problem, sets the stage for how we are going to talk about the problem, how we are going to think about it, and therefore solve it. Let’s see an example.

## Gossip vs Epidemics ##

Back in the ’80s researchers at the Xerox Palo Alto Research Center were trying to find a new way to [replicate data for database maintenance](https://www.cis.upenn.edu/~bcpierce/courses/dd/papers/demers-epidemic.pdf)[2]. They framed this problem under the idea of gossip. In this sense, computers spread rumors to other computers, in a similar fashion as how people do that, say, in an office setting. With this metaphor, we can easily explain how the algorithm disseminates data, since while we are not in the business of spreading rumors, we have experience of seeing others do it ;-)

So here, gossip works as a generative metaphor that helps frame the problem, and reason about it. But there is a problem with it. While gossip makes it really easy to talk about the problem, it makes it hard to formally reason about it. These researcher found a new way to frame the problem: epidemics.

Thanks to epidemics they found that there was a [Mathematical Theory of Epidemics](https://www.amazon.com/Mathematical-Theory-Epidemics-Norman-Bailey/dp/0852641133), which they could use to formally reason about their algorithms. Also it provided a framework that was also useful for explaining their algorithms.

So there we have two generative metaphors that helped frame a problem, guided their solutions, and in one case, even brought for free a mathematical theory to help reason about the problem.

Are there other interesting instances of Generative Metaphors?

## The Guest/Host Relationship ##

In Human Centered Design there’s the idea of the [Guest/Host](http://www.eamesoffice.com/the-work/the-guest-host-relationship/) relationship[3]. This generative metaphor induces you to think of a design problem, be it a new product, or an software API, around the question of _how do you treat people when you invite them to your home_?

This idea was presented by the designer Charles Eames during an interview:

>[…] a very good, thoughtful host, all of whose energy goes into trying to anticipate the needs of his guests. […] We decided that this was an essential ingredient in the design of a building or a useful object.

This generative metaphor allowed them to frame their problems from that point of view. Now try to image what would happen if we use this mindset when we build the APIs that conform our software. How welcoming are them? How much do they try to anticipate the needs of our future users? Would our users need to find workarounds to these APIs so they can get things done? Think about the word work-around. It immediately sounds like something we wouldn’t want to deal with when we use someone else’s API.

## The Idea of the Labyrinth ##

Recently I [wrote](https://increment.com/documentation/notes-on-the-synthesis-of-labyrinths/) about how we can frame the process of writing software as that of traversing a labyrinth[4]. We explore many avenues, try many ideas, but there’s just one path that’s materialized in the code. All the other paths get discarded along the way. This causes that we lose the reasoning behind some decisions that are implicit in the code. Later on when we want to understand that code, we end up scratching our heads, because what led to those decisions is not entirely clear by reading the code alone.

On the other hand if we understand this process as labyrinthine, then we can see how it is necessary to explain to our colleagues the paths that we traversed, but that didn’t make it to the code, to the final documentation, or the report.

## Language vs. Tool ##

Finally I want to set the stage for a next article I’d like to write. About what are the implications behind thinking of Programming Languages as Languages vs. seeing them as _Tools_.

We are so used to call them Programming _Languages_ that we don’t stop to reflect what are the implications of treating them as languages, and where the language metaphor breaks off. But again, I just wanted to get the ball rolling, the match will be played in a future article.

## Conclusion ##

Here I presented just a few examples that show how metaphors let us talk and think about problems under the limits set by the framework that’s implicit in the metaphor. It would be an interesting exercise to try to find what are the metaphors that guide our day to day programming. Just to give one last example, what are the implications of calling `git-blame`, [git blame](https://twitter.com/Una/status/911767625864286208)?

If you would like to read more about Generative Metaphor, I’d recommend the paper by Schön cited above.

## References: ##

1. Schön, D. 1979. Generative Metaphor: A Perspective on Problem-Setting in Social Policy. Metaphor and Thought. Cambridge University Press.
2. Demers, A., Greene, D., Hauser, C., Irish, W., Larson, J. 1987. Epidemic algorithms for replicated database maintenance. Proceedings of the Sixth Annual ACM Symposium on Principles of Distributed Computing: 1–12.
3. Eames, C. 1972. The Guest/Host Relationship. [http://www.eamesoffice.com/the-work/the-guest-host-relationship/](http://www.eamesoffice.com/the-work/the-guest-host-relationship/)
4. Videla. A. 2018. Notes on the synthesis of labyrinths. Increment Magazine.

## Credits: ##

Photo by [Daniel Porta](https://www.flickr.com/photos/flacoporta/)