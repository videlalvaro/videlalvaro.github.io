---
layout: post
title: Haskell and RabbitMQ
---

# {{page.title}}

<span class="meta">September 09 2010</span>

Since long time I wanted to try the [Haskell AMQP library that's on hackage](http://hackage.haskell.org/package/amqp), both to practice some Haskell and to learn more about RabbitMQ's default exchanges.

If you go to your _rabbitmqctl_ and try the following command: 

{% highlight sh %}
./rabbitmqctl list_exchanges
{% endhighlight %}

Among the list of exchanges you will see a topic exchange by the name _amq.rabbitmq.log_. As you can guess, RabbitMQ will be sending logs to that exchange. Since it's a topic exchange, I wanted to find out which routing keys was RabbitMQ using. If we check inside _rabbit\_error\_logger.erl_ on RabbitMQ's source code, we'll find that the server is using three routing keys, depending on the log level:

- error
- warning
- info

So we could have tree queues as the destination for the log messages. 

In the following example I'll try to show how to consume messages from three private queues. The idea is that we could "spy" the server events on demand, and when we stop the consumers the queues should be gone. AMQP has a neat feature to allow this kind of use case which is to declare queues with no name –the server will provide a random name–, giving the _auto\_delete_ and _exclusive_ options as *true* and _durable_ as *false*. Then when our consumer get disconnected, the queue is deleted from the server.

Here's the code based on the examples from the AMQP library

{% highlight haskell %}
--RabbitMQLogs.hs

import Network.AMQP

import qualified Data.ByteString.Lazy.Char8 as BL


main = do
    conn <- openConnection "127.0.0.1" "/" "guest" "guest"
    chan <- openChannel conn
    
    --declare queues
    errorQueue    <- declareQueue chan anonQueue
    warningQueue  <- declareQueue chan anonQueue
    infoQueue     <- declareQueue chan anonQueue
    
    putStrLn "Queues Declared: "
    mapM_ putStrLn [errorQueue, warningQueue, infoQueue]
    
    -- bind queues
    bindQueue chan errorQueue "amq.rabbitmq.log" "error"
    bindQueue chan warningQueue "amq.rabbitmq.log" "warning"
    bindQueue chan infoQueue "amq.rabbitmq.log" "info"
    
    --subscribe to the queues
    consumeMsgs chan errorQueue Ack callbackError
    consumeMsgs chan warningQueue Ack callbackWarning
    consumeMsgs chan infoQueue Ack callbackInfo
    
    putStrLn $ "waiting for logs…"
    
    getLine -- wait for keypress
    closeConnection conn
    putStrLn "connection closed"

anonQueue :: QueueOpts
anonQueue = QueueOpts "" False False True True
    

callbackError :: (Message, Envelope) -> IO ()
callbackError (msg, env) = do
    putStrLn $ "error: " ++ (BL.unpack $ msgBody msg)
    ackEnv env
    
callbackWarning :: (Message, Envelope) -> IO ()
callbackWarning (msg, env) = do
    putStrLn $ "warning: " ++ (BL.unpack $ msgBody msg)
    ackEnv env
    
callbackInfo :: (Message, Envelope) -> IO ()
callbackInfo (msg, env) = do
    putStrLn $ "info: " ++ (BL.unpack $ msgBody msg)
    ackEnv env

{% endhighlight %}

The code is pretty self explanatory. First we create the connection to RabbitMQ and obtain a channel. The _declareQueue_ function expects a _channel_ and the _QueueOpts_ which we provide by calling the _anonQueue_ function. This function will return the following record:

{% highlight haskell %}

QueueOpts { queueName = ""
  , queuePassive = False
  , queueDurable = False
  , queueExclusive = True
  , queueAutoDelete = True 
}

{% endhighlight %}

By calling _declareQueue_ we get back the random name assigned by RabbitMQ to our queue. We declare three queues, one for each log level and then we bind them to the _amq.rabbitmq.log_ exchange using the respective routing key.

Once the queues are bound we set up our callback consumers like this:

{% highlight haskell %}
consumeMsgs chan errorQueue Ack callbackError
{% endhighlight %}

There we are saying that the messages sent to the _errorQueue_ will be processed by the "callbackError" function. 

Finally on key press, we will close the connection.

Providing that the code is on the file _RabbitMQLogs.hs_ we can test it like this:

{% highlight sh %}
runghc RabbitMQLogs.hs
{% endhighlight %}

Then on another Terminal window you could start/stop any RabbitMQ consumer/producer and you should start seeing messages like this:

{% highlight sh %}
info: closing TCP connection <0.2393.0> from 127.0.0.1:59145

warning: exception on TCP connection <0.313.0> from 127.0.0.1:58657
connection_closed_abruptly

info: closing TCP connection <0.313.0> from 127.0.0.1:58657

info: accepted TCP connection on 0.0.0.0:5672 from 127.0.0.1:59195
{% endhighlight %}

Of course to get all of this working you will have to install the AMQP library. The following command should suffice:

{% highlight sh %}
cabal install amqp
{% endhighlight %}

I really like Haskell as a language, so I'm quite happy that now there's a library to use it with RabbitMQ which is another nice piece of software.