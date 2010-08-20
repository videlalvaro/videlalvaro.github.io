---
layout: post
title: Riak Map/Reduce Queries in Clojure
---

# {{page.title}}

<span class="meta">August 14 2010</span>

Over this week I've been working on a proof of concept to see if it's possible to use Clojure as the map/reduce language for Riak, in the same way now we can use Javascript and Erlang for that purpose. To accomplish that I needed a way to call Clojure code from Erlang. So I set up a very simple server in Clojure that runs as an Erlang node using [Closerl](http://github.com/videlalvaro/closerl).

After startup that server will ping the Riak node to start a connecting and then will wait for incoming map/reduce queries. Then when there's a m/r request to Riak it will send a a message like this: *{slef(), Command, Value, CljFun}*, where Command will be the atom *map* or *red* –indicating the operation to perform–, Value is the return riak_object:get_value(Object), and CljFun is the function sent in the JSON request.

When the Clojure server receives the message, it will do some processing and marshaling to the data, and the it will apply the CljFun to the Value. The CljFun will be read using _(read-string fval)_. I wrote some helpers that the function can call to do the processing and the assembly of the reply to Riak, which I will document later.

So, how does a Map/Reduce request looks like in this case? Based on the examples for the Riak Wiki this will be a similar query but for Clojure:

{% highlight sh %}
curl -X POST -H "content-type: application/json" http://localhost:8098/mapred --data @-
{"inputs":[["alice","p1"],["alice","p2"],["alice","p5"]],"query":[{"map":{"language":"clojure","source":"(fn [data]  (let [words (re-seq #\"\\w+\" data)] (map (fn [v] (closerl/otp-tuple (closerl/otp-binary v) (closerl/otp-long 1))) words)))"}},{"reduce":{"language":"clojure","source":"(fn [vs] (let [v1 (remove-struct (remove-not-found vs)) v2 (apply concat v1) v3 (reduce (fn [m v] (assoc m (first v) (+ (get m (first v) 0) (second v)))) {} v2)] (as-proplist v3 closerl/otp-binary closerl/otp-long)))"}}]}
{% endhighlight %}

From all this mess let's extract the map function:

{% highlight clj %}
(fn [data]
  (let [words (re-seq #\"\\w+\" data)] 
  (map (fn [v] (closerl/otp-tuple (closerl/otp-binary v) (closerl/otp-long 1))) words)))
{% endhighlight %}

And the reduce function:

{% highlight clj %}
(fn [vs] 
  (let [v1 (remove-struct (remove-not-found vs)) 
        v2 (apply concat v1) 
        v3 (reduce (fn [m v] (assoc m (first v) (+ (get m (first v) 0) (second v)))) {} v2)] 
  (as-proplist v3 closerl/otp-binary closerl/otp-long)))
{% endhighlight %}

What have here are a couple of anonymous functions that have access to some Clojure libraries for processing the data. For example in in the reduce example we want to return a data structure like:

    [{<<"word1">>, Count1}, {<<"word2">>, Count2}, ...]
    
To do that we call the helper *as-proplist*  to accomplish that. It will iterate the map of key value pairs passed to it and then wrap them in the Erlang types passed as second and third parameters.

At this point you are probably asking yourself about how advanced is this POC, is it stable, can I use it in production tomorrow, etc. I will try to address those points now.

What's missing on the Erlang side of things:

- Better integration with rebar. Rebar should be able to pull the closerl repo and compile it.
- The Clojure node name is hardcoded inside *riak_kv_clj_vm:call_clojure*
- *riak_kv_clj_vm* needs to be able to launch the Clojure environment. At the moment is launched by hand.
- When launching the jvm we need to pass it parameters related to Riak's node name, cookie, etc.
- Improve error handling when calling Clojure.
- Write code to relaunch the JVM.
- Polish the code implementation, suggestions are welcomed, NOT! :)

What's missing on the Clojure side of things:

- Add error handling for malformed functions.
- Improve error handling when calling map and reduce functions.
- Improve error handling when doing data type conversion from/to Erlang.
- Add more helpers, load more libraries by default.
- Polish the code implementation, suggestions are welcomed.

As you can see there's a lot to do, but if you check the code, there's a lot ready to.

How can I get to play with it?

1) Get Riak's code:

    git clone http://github.com/basho/riak.git
    
2) Get riak_kv code from my fork:

    git clone http://github.com/videlalvaro/riak_kv.git
    
3) Get Closerl code:

    git clone http://github.com/videlalvaro/closerl.git
    
4) Modify Riak's code:

In *rebar.config* point the dependency on *riak_kv* to your copy of the fork that you just've cloned:

  {riak_kv, "0.12.0", {git, "/path/to/riak_kv", "HEAD"}}
  
In *rel/files/vm.args change the Erlang parameters from *name* to *sname*

In *rel/vars.config* change the node name from *riak@127.0.0.1* to *riak*

Once you did that then cd into the riak folder and run:

{% highlight sh %}
./rebar get-deps
./rebar compile
./rebar generate
rel/riak/bin/riak console
{% endhighlight %}
  
You are half done by now. Next step is to cd into the Closerl folder and run the following commands [1]:

{% highlight sh %}
lein deps
lein run run.clj
{% endhighlight %}
  
That will start the map-reduce server. You should see some output like:

{% highlight clj %}
#<OtpNode clj2@mrhyde>
#<OtpMbox com.ericsson.otp.erlang.OtpMbox@4a504ec1>
true
running m/r server
{% endhighlight %}

The important thing here is that you see that *true* there before the "running m/r server" message. That means that Clojure could connect to the Erlang node where Riak is running.

Now following the example from the Riak wiki you could try the following in a separate Terminal:

{% highlight sh %}
#insert some data in riak:
curl -X PUT -H "content-type: text/plain" \
 http://localhost:8098/riak/alice/p1 --data-binary @-
Alice was beginning to get very tired of sitting by her sister on the
bank, and of having nothing to do: once or twice she had peeped into the
book her sister was reading, but it had no pictures or conversations in
it, 'and what is the use of a book,' thought Alice 'without pictures or
conversation?'
^D

curl -X PUT -H "content-type: text/plain" \
 http://localhost:8098/riak/alice/p2 --data-binary @-
So she was considering in her own mind (as well as she could, for the
hot day made her feel very sleepy and stupid), whether the pleasure
of making a daisy-chain would be worth the trouble of getting up and
picking the daisies, when suddenly a White Rabbit with pink eyes ran
close by her.
^D

curl -X PUT -H "content-type: text/plain" \
 http://localhost:8098/riak/alice/p5 --data-binary @-
The rabbit-hole went straight on like a tunnel for some way, and then
dipped suddenly down, so suddenly that Alice had not a moment to think
about stopping herself before she found herself falling down a very deep
well.
^D

#get data back just for a sanity check:
curl -X GET -H "content-type: text/plain" http://localhost:8098/riak/alice/p1

# run Clojure M/R Query:
curl -X POST -H "content-type: application/json" http://localhost:8098/mapred --data @-
{"inputs":[["alice","p1"],["alice","p2"],["alice","p5"]],"query":[{"map":{"language":"clojure","source":"(fn [data]  (let [words (re-seq #\"\\w+\" data)] (map (fn [v] (closerl/otp-tuple (closerl/otp-binary v) (closerl/otp-long 1))) words)))"}},{"reduce":{"language":"clojure","source":"(fn [vs] (let [v1 (remove-struct (remove-not-found vs)) v2 (apply concat v1) v3 (reduce (fn [m v] (assoc m (first v) (+ (get m (first v) 0) (second v)))) {} v2)] (as-proplist v3 closerl/otp-binary closerl/otp-long)))"}}]}
^D
{% endhighlight %}


You should see some output like:

{% highlight js %}
[{"hole":1,"moment":1,"Alice":3,"into":1,"picking":1,"a":6,"could":1,"no":1,"once":1,"but":1,"chain":1,"herself":2,"eyes":1,"sleepy":1,"down":2,"found":1,"be":1,"conversation":1,"or":3,"dipped":1,"sister":2,"what":1,"getting":1,"having":1,"in":2,"with":1,"feel":1,"own":1,"use":1,"that":1,"falling":1,"tunnel":1,"without":1,"twice":1,"White":1,"for":2,"book":2,"was":3,"considering":1,"is":1,"do":1,"it":2,"had":3,"making":1,"sitting":1,"deep":1,"reading":1,"hot":1,"about":1,"pleasure":1,"nothing":1,"worth":1,"well":2,"way":1,"conversations":1,"she":4,"daisies":1,"The":1,"the":7,"as":2,"mind":1,"think":1,"daisy":1,"not":1,"stopping":1,"some":1,"went":1,"made":1,"would":1,"her":5,"pictures":2,"whether":1,"very":3,"pink":1,"get":1,"by":2,"of":5,"and":5,"trouble":1,"stupid":1,"like":1,"suddenly":3,"close":1,"thought":1,"rabbit":1,"Rabbit":1,"straight":1,"when":1,"to":3,"up":1,"tired":1,"bank":1,"so":1,"So":1,"day":1,"beginning":1,"then":1,"ran":1,"on":2,"peeped":1,"before":1}]
{% endhighlight %}

And that's it! Thanks for reading this long and please post your comments about this topic.

Notes:

1 - As you can see I'm expecting that you have *leiningen* installed, which is pretty easy, just follow the steps [here](http://github.com/technomancy/leiningen).