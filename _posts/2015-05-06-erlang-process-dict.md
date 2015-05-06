---
layout: post
title: "This Erlanger Used The Process Dict, Look What He Found"
---

# {{page.title}} #

![Erlang Process Dictionary Considered](/images/l4grp.jpg)

Erlang has something called
[Process Dictionary](http://www.erlang.org/course/advanced.html#dict)
which is a sort of Key/Value store that belongs to each Erlang
process. We can use it to store values in a simple manner inside Erlang
programs while avoiding the limitations of Pure Functional
Programming. The anti-flames suit is sold separately tho.

There are
[some](http://prog21.dadgum.com/53.html)
[articles](http://ferd.ca/on-the-use-of-the-process-dictionary-in-erlang.html)
out there describing the good and bad uses of the process dictionary,
so if you want to get the big picture, go and read there. I won't be
talking about that.

What I do want to talk about is something I've found while reading
Erlang's process dictionary implementation. You can find
the source code on Github:
[erl_process_dict.c](https://github.com/erlang/otp/blob/maint/erts/emulator/beam/erl_process_dict.c).

What caught my attention there was the function called
`erts_dictionary_copy` defined
[here](https://github.com/erlang/otp/blob/maint/erts/emulator/beam/erl_process_dict.c#L220). From
that function name is clear that Erlang
[copies](https://github.com/erlang/otp/blob/maint/erts/emulator/beam/erl_process_dict.c#L251)
the process dictionary, but why/when? According to the comments to
that function plus a quick search for places where it is called, we
can see that it is there mostly for reporting purposes. Whenever we
ask Erlang for a `process_info/1`, that particular process' dict will
be copied. In the case of `process_info/2` the dict copying will only
happen if we specifically request for the `dictionary` info key.

Now, if we store lots of things in process dictionaries, (note: we
shouldn't), then our Erlang app could see a RAM usage spike, or
perhaps OOM on us, who knows. Something similar could happen if we
have to inspect several thousands of processes while accessing their
dicts via `process_info/1,2`.

While using the process dictionary can be a source of discussion about
proper Erlang code etiquette, we can tell for sure that it _could_ be
problematic on a production system, for the reasons stated above.

TL;DR: use the process dictionary with care, call
`erlang:process_info/1,2` with extra care.

## Experiment Time ##

If you are brave enough and want an unrealistic experiment, just try
the following:

Create a module with the following code. The only purpose of this
module is to start a process and store some values on that process
dictionary.

{% highlight erlang %}
-module(memory).

-export([start/0]).

start() ->
    spawn(fun loop/0).

loop() ->
    receive
        {set, Key, Val} ->
            put(Key, Val),
            loop()
    end.
{% endhighlight %}

Then start a repl like this: `erl +K true` and run the following
commands. Note, you'll need a 3MB file or similar, for science.

{% highlight erlang %}
%% compile the module
1> c(memory).
%% Load a file, size is arbitrary but a file too big will make the VM
%% crawl with what follows
2> {ok, Bin} = file:read_file("my_at_least_3MB_file.something").
3> L = binary_to_list(Bin).
4> Pid = memory:start().
%% keep N low, a value of 100 makes my VM unresponsive in my 16GB of
%% RAM Retina Mac.
5> N = 10.
6> [Pid ! {set, Key, L} || Key <- lists:seq(1, N)].
%% use Activity Monitor or similar to check beam.smp memory usage.
%% next line will double memory usage since the dictionary will be
%% duplicated
7> erlang:process_info(Pid, dictionary).
{% endhighlight %}

If everything ran as expected, you should have seen the `beam.smp` RAM
usage spiking to about the double of what was before you called
`process_info/2`.

That was a rather artificial experiment to prove a point, but if
academia taught me anything, is that I should run artificial and
carefully selected experiments to prove my points.
