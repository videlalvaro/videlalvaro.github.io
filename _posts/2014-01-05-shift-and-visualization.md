---
layout: post
title: Shift-And Visualization
---

# {{page.title}} #

<span class="meta">January 05 2014</span>

In this article I would like to describe the Shift-And algorithm for pattern matching, based on the book [Flexible Pattern Matching in Strings](http://www.amazon.com/Flexible-Pattern-Matching-Strings-Algorithms/dp/0521039932). Apart from the actual description, you can scroll down for a demonstration of how the algorithm works.

Shift-And is categorized as a prefix-based algorithm, similar to KMP, but what Shift-And does is to keep a set of all prefixes `p` that matches a suffix of the text read so far. Keep in mind that is the suffix of the text read _so far_, not a suffix of the whole text.

The set of prefixes is updated using __bit-parallelism__, that is, the set of prefixes is kept in a bit mask called `D`. `D` is defined as: d<sub>m</sub> ... d<sub>1</sub>, where `m` is the canonical way of referring to the pattern length. For example, if we have a six character pattern, and so far our first character matches against the text, then `D` would be `000001`. 

With every character read from the text, `D` will be updated, if the bit d<sub>m</sub> is active, then we have a match. Is it possible to update this set in constant time? Yes, using __bit-parallel__ operations.

This algorithm will first build a table `B`, holding a bit mask b<sub>m</sub> ... b<sub>1</sub> for every character in the pattern. So, if we are searching for the word `announce`, the entry for the character `n` will look like this: `00100110`, that is, the word `announce` has an `n` in the 2nd, 3rd and 6th positions, which are marked in the bit mask from right to left. So to recap: the algorithm will scan the pattern we are searching, and then it will build this table, updating the bit mask as it goes. Here's the code in javascript:

{% highlight javascript %}
// init the table
for (var i = 0; i < l; i++) {
    b[p.charAt(i)] = 0;
}

//build bit mask table;
for (var i = 0; i < l; i++) {
    b[p.charAt(i)] = b[p.charAt(i)] | (1 << i);
}
{% endhighlight %}

So the bit mask table for the word announce will end up looking like this:

{% highlight javascript %}
var B = {
  'a': 00000001,
  'n': 00100110,
  'o': 00001000,
  'u': 00010000,
  'c': 01000000,
  'e': 10000000,
  '*': 00000000
}
{% endhighlight %}

Of course we will have the actual numbers, not those bit masks., with the padding and os on. We also added an `*` entry in the table. That's because whenever a read character from the text doesn't matches, then the bit mask used will be `0`.

Once we have the table built, we start searching for the pattern in the text. First we set `D` to `0`, and then we start reading from the text, character by character. Let's say we read an `a`, so we search for the `a` bit mask in our table, it will return `00000001`. To calculate the new `D` we first shift it `1` to the left, and we `OR` a `1` to it : `(D << 1) | 1`. That value gets `AND'ed` to the mask we retrieved from the table, so this would be the complete line: `D <- ((D << 1) | 1) & B[current-char]`.

We keep iterating over the text until we find a match. How do we find a match? We need to check if the bit d<sub>m</sub> is active. To do that we have to run the following operation: `D & (1 << m-1)`. We create the following bit mask `10000000` and we `AND` it to `D`. If this is not `0`, then we have a match.

Here's the complete algorithm in a vanilla implementation using Javascript:

{% highlight javascript %}
/**
  * string p: pattern to search (needle);
  * string text: haystack
**/
function shift_and(p, text) {
    var b = {};
    var l = p.length;
    var tl = text.length;
 
    // init the table
    for (var i = 0; i < l; i++) {
        b[p.charAt(i)] = 0;
    }

    //build bit mask table;
    for (var i = 0; i < l; i++) {
        b[p.charAt(i)] = b[p.charAt(i)] | (1 << i);
    }
 
    d = 0;
    var matchMask = 1 << l-1;
    for (var i = 0; i < tl; i++) {
        d = ((d << 1) | 1) & (b[text.charAt(i)] | 0);
        var matched = (d & matchMask);
        if (matched != 0) {
            return i - l + 1;
        }
    }
    return -1;
}
{% endhighlight %}

And now to the interesting part, the visual simulation:

## Shift-And visual simulation ##

Let me briefly explain what's going on here. First we have a form, where you can enter the pattern to search, and the text where to search it for. That's easy.

Once hit `start`, the visualization will display the text and bellow it the pattern you are searching for. Beneath them, there will be the `b table` and next to it, the results of each step will be reported. 

For example, we will see the initial value of D, then it will be `(D << 1) | 1`. Then we read a character from the text, and we get the value from the table, `AND'ing` it to the value of `D` and getting the result below, and so on.

I hope the colors are pretty self explanatory (I'm colorblind so don't trust me on this one).

So, click __start__ and enjoy the show.

<link rel="stylesheet" href="/css/sand.css" type="text/css" media="screen" title="no title" charset="utf-8" />
<div class="shiftand">
<h4>Shift-And</h4>
<form id="shiftand">
    <label for="pattern">Pattern:</label>
    <input id="pattern" type="text" name="pattern" value="announce" size="70" />
    <label for="text">Text:</label>
    <textarea id="text" name="text" cols="50" rows="3">annual_announce</textarea>
    <input type="submit" value="start" />
</form>
<div id="vis_container" class="hidden">
  <div id="text_blocks">
    <h5>Visualization</h5>
    <div id="the-haystack">
      
    </div>
    <div id="the-needle">
    </div>
  </div>
  <div id="bitrun">
    <div id="bitmask">
        <h5>Bit-mask Table</h5>
        <ul id="bitmask-table" class="table"></ul>
    </div>
    <div id="match-run">
        <h5>Run</h5>
        <pre></pre>
     </div>
  </div>
</div>
</div>
<script type="text/javascript" charset="utf-8" src="/javascripts/jquery-1.9.1.js">
  
</script>
<script type="text/javascript" charset="utf-8" src="/javascripts/jquery-ui-1.10.3.custom.js">
  
</script>
<script type="text/javascript" charset="utf-8" src="/javascripts/forms.js">
  
</script>
<script type="text/javascript" charset="utf-8" src="/javascripts/shift_and.js">
  
</script>

I hope this post has made justice to what I think is one of the most elegant algorithms that I know of. If you are interesting in learning more about Pattern Matching in Strings, then I would recommend you get a copy of the book [Flexible Pattern Matching in Strings](http://www.amazon.com/Flexible-Pattern-Matching-Strings-Algorithms/dp/0521039932) since it's really worth every penny.

I would like to mention also Mr. [@sicher](https://twitter.com/sicher) who basically single handedly fixed the mess of HTML and CSS that I had created. So if you enjoyed the visual styles, then send him some props on twitter.