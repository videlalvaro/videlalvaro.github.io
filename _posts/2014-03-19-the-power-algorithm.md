---
layout: post
title: The Power Algorithm
---

# {{page.title}} #

<span class="meta">March 19 2014</span>

In this blog post I would like to show how a very basic idea like
raising a number to a certain power could lead us to discover
abstractions like Semigroups and Monoids.

There's a very well known algorithm for calculation powers, that is _x
to the power of n_ or simply: `x^n`. Donald Knuth presents the
algorithm in section 4.6.3 of TAOCP under the section _Evaluation of
Powers_.

The naïve way to implement this algorithm would be to multiply `x` by
itself `n` times, but of course the idea is to provide an algorithm
that's faster than this. The algorithm in question is usually called
the _binary method_, the _powering ladder_ or the _repeated-squaring_
algorithm.

Say we want to calculate `2^23`, where `x = 2` and `n = 23` this
algorithm takes into account the binary representation of `23`
(`10111`), scans it and depending if it finds a `0` or a `1` it will
either square `x` or multiply by `x`.

The problem with this method is that it scans the binary representation
of the number from left to right, but for computers it's usually
easier to do it the other way around, so Knuth proposes a alternative
algorithm.

A simple implementation of _Algorithm A_ from section _4.6.3_ of TAOCP
is as follow:

{% highlight php %}
<?php
function power1($x, $n) {
    $y = 1;

    while (true) {
        $t = $n % 2;
        $n = floor($n/2);

        if ($t == 1) {
            $y = $y * $x;
        }

        if ($n == 0) {
            break;
        }

        $x = $x * $x;
    }

    return $y;
}
{% endhighlight  %}

This function takes two integers, `$x` and `$n` and returns `$x` to
the power of `$n`.

First it sets an auxiliary variable `$y` to `1` which is the identity
of the multiplication.

Then function scans the binary representation of `$n` on each
iteration of the loop. If it finds a `1` then it multiplies by
`$x`. On every step of the loop it squares `$x`.

_Finding a 1_ means that the current value of `$n` is not divisible by
`2`, or in other words, `$n % 2 == 1`.

Also on every iteration of the loop `$n` gets halved and then we apply
`floor` to the result. When `$n` equals `0`, we terminate the loop and
return the value of `$y`.

The function `power` can be called like this:

{% highlight php %}
1024 == power1(2, 10);
=> true
{% endhighlight  %}

At this point I imagine you being like the guy on this gif:

![CSB](/images/csb.gif)

While the algorithm really looks like a CSB, it is actually quite
effective when it comes to computing with very big numbers. For
example there are many primality testing algorithms that depend on
variations of this algorithm.

## Adding some abstraction ##

So far nothing fancy, but if we notice that raising a number to a
power is actually the same as multiplying the number by itself that
many times, we could also see that multiplication is the same as
adding a number by itself that many times. So for example `2 * 5`
could be computed by doing `2 + 2 + 2 + 2 + 2`.

Can we convert our algorithm into a more generic form that would work
for multiplication and addition? Of course we can. We just need to
change a couple of things.

On the current implementation we set `$y` to the identity element of
multiplication, namely `1`. If we want to use the algorithm for
addition, then we need to set $y to `0`. So we could just pass the
value of our identity element to the function.

The second step would be to provide a function to our algorithm that
would do either multiplication or addition. To do that we will pass a
function that will act as a binary operation, i.e.: a function that
takes two arguments. This function needs to follow some rules as well,
that is, it has to be associative: `a⁡• (b • c) = (a • b) •`. Also the
type of the result value must be the same type as both input
parameters.

Luckily for us addition and multiplication are associative operations,
so we can just wrap them in a function and pass it to our `power`
algorithm.

Here's the new implementation of the algorithm:

{% highlight php %}
<?php
function power2($x, $n, $id, $f) {
    $y = $id;

    while (true) {
        $t = $n % 2;
        $n = floor($n/2);

        if ($t == 1) {
            $y = $f($y, $x);
        }

        if ($n == 0) {
            break;
        }

        $x = $f($x, $x);
    }

    return $y;
}
{% endhighlight %}

And we can call it like this:

{% highlight php %}
1024 == power2(2, 10, 1, function ($a, $b) { return $a * $b; });
=> true
{% endhighlight %}

As you can see there we passed `1` as our identity element, and we
provided a function that takes `2` arguments and returns the result of
their multiplication. Nothing fancy.

But now say we want to calculate `2 * 10` using our algorithm. We
could wrap the addition operator inside a function and then pass `0` as
the identity element like this:

{% highlight php %}
20 == power2(2, 10, 0, function ($a, $b) { return $a + $b; });
=> true
{% endhighlight %}

Keep in mind that the operation that we pass to our algorithm must be
associative, for example, subtraction can't be used here since for
example `10 - (5 - 3) = 8` while `(10 - 5) - 3 = 2`.

## Appending more abstraction  ##

Mathematically speaking this algorithm works with any algebraic
structure that has an associative operation (like multiplication and
addition in the case of integers), that is, it works on Semigroups. To quote a book on Group
Theory:

A _semigroup_ set S equipped with an associative binary operation •;
that is, x • (y • z) = (x • y) • z for all x, y, z ∈ S.

Also, that set must have an identity element, which makes it a Monoid:

A _monoid_ is a set M equipped with an associative binary operation •;
together with an identity element e ∈ M that satisfies e • x = x • e =
x for all x ∈ M.

What other structures that we use every day in programming can work
under the previous conditions? If you are a web developer you don't
need to dig so much to find strings. Strings, using _string append_ as
the binary operation and the _empty string_ as the identity element
would give use similar results as above. If we wanted to _repeat_ a
string `n` times, we could create the following function:

{% highlight php %}
function repeat($s, $n) {
    return power2($s, $n, "", function ($a, $b) {
               return $a . $b;
           });
}
{% endhighlight %}

And to test it:

{% highlight php %}
"aaaaaaaaaa" == repeat("a", 10);
=> true
{% endhighlight %}

Now think about arrays (or lists in other languages). We could want to
build an array with `n` copies of the same element. Here the _empty
array_ is the identity element, and in the case of PHP _array\_merge_
would be our binary operation.

{% highlight php %}
function repeat_el($el, $n) {
    return power2(array($el), $n, array(), function ($a, $b) {
            return array_merge($a, $b);
           });
}
{% endhighlight %}

And here are our results:

{% highlight php %}
$arr = repeat_el("a", 10);
10 == count($arr);
=> true
{% endhighlight %}

As you can see here, something that seemed so simple as raising a
number to a certain power gave us a neat algorithm that can be used
for several things, like repeating strings or elements inside an
array.

## Further Reading ##

The power algorithm as implemented here is based on
[TAOCP](http://www-cs-faculty.stanford.edu/~uno/taocp.html), Vol II,
section 4.6.3.

The whole explanation of how this works can be found in TAOCP or in
the book
[A Computational Introduction to Number Theory and Algebra](http://shoup.net/ntb/). The
PDF of the book is freely available on the author's website. Look into
section "Computing with large integers - The repeated squaring
algorithm".

If you would like to learn about several uses for this algorithm and
some more theory behind it, then consult the book called
[Elements of Programming](http://www.amazon.com/Elements-Programming-Alexander-Stepanov/dp/032163537X). This
book is great in the way it defines the different types of functions,
and how it uses the type system to be sure that the function is
actually associative, binary, and so on. The author is the designer of
C++ STL, so while the concerns of the book might seem very
theoretical, then can be directly applied in OOP programs.

The quotes about Semigroups and Monoids are from the book
[Handbook of Computational Group Theory](http://www.amazon.com/Handbook-Computational-Discrete-Mathematics-Applications/dp/1584883723/). A
very interesting book if you are into CGT.

If you want to learn more about Monoids and their implementations this
chapter from _Learn You a Haskell_ has a very nice introduction to
[Functors, Applicative Functors and Monoids](http://learnyouahaskell.com/functors-applicative-functors-and-monoids#monoids).

It could be an interesting exercise to implement these concepts using
say PHP and OOP, or for the PHP non lovers, in some other imperative
language of your choice.

## Did you just say Haskell? ##

Since I've mentioned a Haskell book, here's an implementation of the
power algorithm, using a recursive algorithm based on the book
[Prime Numbers: A Computational Perspective](http://www.amazon.com/Prime-Numbers-Computational-Richard-Crandall/dp/0387252827/).

{% highlight haskell %}
power :: (Eq a, Integral b) => (a -> a -> a) -> a -> b -> a
power f a n
  | n == 1 = a
  | even n = square a (n `div` 2)
  | otherwise = f a (square a ((n-1) `div` 2))
  where
    square a' n' = f (power f a' n') (power f a' n')
{% endhighlight %}

And here are the results of several invocations of the function:

{% highlight haskell %}
*Main> :load pow.hs
[1 of 1] Compiling Main             ( pow.hs, interpreted )
Ok, modules loaded: Main.
*Main> power (*) 2 10
1024
*Main> power (+) 2 10
20
*Main> power (++) "a" 10
"aaaaaaaaaa"
{% endhighlight %}

As you can see there, the function takes a function `(a -> a -> a)`
which could be either `*` or `+` for integers, or `++` for lists, for
example.

I hope you found this blog post interesting, and that I have whetted
your appetite for learning maths in relation to programming, since I
think the more we grasp these ideas, the better the abstractions we
would be able to use.
