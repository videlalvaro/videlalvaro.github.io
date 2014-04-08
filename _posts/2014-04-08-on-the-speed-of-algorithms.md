---
layout: post
title: On the speed of Algorithms and Faster Hardware
---

# {{page.title}} #

<span class="meta">April 08 2014</span>

Today I've read on Twitter a half-joke saying that basically we can
just implement our code and then wait for faster computers to improve
the speed of our programs. As many might know, that's not actually the
case, but instead of trying to explain this, I'd prefer to let the
authors of
[The Design and Analysis of Computer Algorithms](http://www.amazon.com/The-Design-Analysis-Computer-Algorithms/dp/0201000296/)
explain that for me.

On section 1.1 of that book the authors are analyzing the speed of
algorithms based on their problem size and their "asymptotic
behavior". They say:

>One might suspect that the tremendous increase in speed of
>calculations brought about by the advent of the present generation of
>digital computers would decrease the importance of efficient
>algorithms. However, just the opposite is true.

Then they propose the following set of algorithms with their time
complexities:

| Algorithm | Time Complexity |
|:--------: |:---------------:|
| A1        | n               |
| A2        | n log n         |
| A3        | n^2             |
| A4        | n^3             |
| A5        | 2^n             |

Where time complexity is the number of steps required to process some
input of size _n_, and one unit of time equals one millisecond.

Then they present the maximum problem size for each algorithm. For
example **A1** would be able to process a problem size of 1000 in one
second, or 3.6 x 10^6 in one hour. Compare that with **A5**, which can
process 9 elements per second, or a maximum of 21 in one hour.


So then we get a computer than is 10 time faster of what he have right
now. Here's the speedup comparison table the authors provide:


| Algorithm    | Time Complexity | Max. Problem Size Before Speed-up | Max. Problem Size After Speed-up |
|:------------:|:---------------:|:---------------------------------:|:--------------------------------:|
| A1           | n               | S1                                | 10 * S1                          |
| A2           | n log n         | S2                                | Approx 10 * S2 for large S2      |
| A3           | n^2             | S3                                | 3.16 * S3                        |
| A4           | n^3             | S4                                | 2.15 * S4                        |
| A5           | 2^n             | S5                                | S5 + 3.3                         |

As we can see, algorithm **A5** could only increase the size of the
problem by **3**.

So does the speed of a computer affects the speed of an algorithms,
yes; is it a significant improvement, usually not, unless of course we
are talking o changes in word sizes, which could benefit numerical
algorithms; or bigger CPU caches and so on.

Still, in general, it's always better to design a proper algorithm, or
even better, use an algorithm designed by the experts.

_Bibliography_:

- Aho, Alfred V., John E. Hopcroft, and Jeffrey D. Ullman. 1974. The design and analysis of computer algorithms. Reading, Mass: Addison-Wesley Pub. Co.
