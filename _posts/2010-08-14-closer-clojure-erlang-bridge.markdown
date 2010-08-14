---
layout: post
title: Closerl - Clojure Erlang Bridge
---

# {{page.title}}

<span class="meta">August 15 2010</span>

In order to learn to program with Clojure I decided to work on a bridge between Clojure and Erlang. Why? I wanted to start by doing something that I'm familiar with. I've worked with erlang_interface before, bridging Erlang with PHP, so I thought that doing the same with Clojure will be a nice exercise. Besides that I've go to learn a lot about the JInterface, the OTP library for bridging Erlang with Java.

The project is called [Closer](http://github.com/videlalvaro/closerl) and is a wrapper around the JInterface, with some helper functions for marshaling values from/to Erlang. Consider the project to be in *very* alpha state. Feel free to report bugs, fixes, and comments so I can improve my Clojure style.

Installation:

First we have to configure the JInterface to work with our mvn local repo. (If there's a better way of doing this let me know, since I'm a complete Java n00b). We use *mvn* to install JInterface. Adapt the following command to suit your specific configuration:

{% highlight sh %}
mvn install:install-file -DgroupId=com.ericsson.otp \
-DartifactId=erlang -Dversion=1.5.3 -Dpackaging=jar \
-Dfile=/usr/local/lib/erlang/lib/jinterface-1.5.3/priv/OtpErlang.jar
{% endhighlight sh %}

Then obtain the *closerl* source code:

{% highlight sh %}
git clone http://github.com/videlalvaro/closerl.git
cd closerl
lein deps
{% endhighlight %}
    
Once we have closerl set up we can fire up the Clojure repl and start typing some commands:

{% highlight clj %}
(use 'closerl.core)

(def self (otp-self "closerl"))

(def peer (otp-peer "rabbit@localhost"))

(def conn (otp-connect self peer))
{% endhighlight %}

Up to here what we did is to connect to the remote node. We have to create our node object and the reference to the remote node. Then we use *otp-connect* to obtain a connection. In this example we connect to a RabbitMQ server running in the local machine. What we are going to do next is to send a message to the RabbitMQ server to retrieve the list of exchanges.

{% highlight clj %}
(otp-rpc-and-receive conn 
  "rabbit_exchange" "list"
  (otp-list (otp-binary "/")))
{% endhighlight %}

The result should be something like this, depending on your RabbitMQ configuration:

{% highlight clj %}
(("exchange" 
  ("resource" "/" "exchange" "amq.direct") "direct" "true" "false" ()) 
("exchange" 
  ("resource" "/" "exchange" "amq.topic") "topic" "true" "false" ()) 
("exchange" 
  ("resource" "/" "exchange" "amq.rabbitmq.log") "topic" "true" "false" ()) 
("exchange" 
  ("resource" "/" "exchange" "amq.fanout") "fanout" "true" "false" ()) 
("exchange" 
  ("resource" "/" "exchange" "amq.headers") "headers" "true" "false" ()) 
("exchange" 
  ("resource" "/" "exchange" "") "direct" "true" "false" ()) 
("exchange" 
  ("resource" "/" "exchange" "amq.match") "headers" "true" "false" ()))
{% endhighlight %}

What we did with *otp-rpc-and-receive* was to call the equivalent of Erlang's *rpc:call(node, module, function, args)*. Instead of using *node* we use our *connection* object. Then the second and third parameters are the module and function respectively.

As arguments we send an Erlang List with only one element, a binary specifiying the *vhost* for which we want the exchanges to be listed. The *otp-list* returns a list of *OtpErlangObject* containing each of the arguments that we passed to the function, which of course should be of the OtpErlangObject type.

At the moment the library offers the following functions for constructing OtpErlangObject values.

- otp-double
- otp-long
- otp-string
- otp-binary
- otp-atom
- otp-tuple
- otp-list

That's it for now. Thanks for reading.