---
layout: post
title: Using RabbitMQ in Unit Tests
---

# {{page.title}}

<span class="meta">April 29 2013</span>

In this blog post I want to show you a very simple technique for using RabbitMQ in our Unit or Functional Tests. Let's say you wrote a bunch of tests for your RabbitMQ consumers and then it's time to run them. To do that you probably need to setup a RabbitMQ server just for tests with their own users and passwords, or you need to set up a whole new virtual host for your tests. While that task is not that hard to accomplish, you might need to setup RabbitMQ and Erlang in order to get the broker running.

With a future release of RabbitMQ that we can already test on the [http://www.rabbitmq.com/nightlies/rabbitmq-server/current/](nightlies website), we can run RabbitMQ without the need to install Erlang. We created a package that ships a stripped down version of Erlang together with the broker bits, so running RabbitMQ now is as easy as downloading a tarball, uncompressing it and starting the server. It's worth noting that this works on Mac for now, but soon we plan to extend it for other platforms.

The tarball is called `rabbitmq-server-mac-standalone-3.0.4.XYZ.tar.gz` where XYZ is the current build version. At the time of this writing this is the current tarball [http://www.rabbitmq.com/nightlies/rabbitmq-server/current/rabbitmq-server-mac-standalone-3.0.4.40426.tar.gz](http://www.rabbitmq.com/nightlies/rabbitmq-server/current/rabbitmq-server-mac-standalone-3.0.4.40426.tar.gz).

The cool thing about that tarball is that we can use it as a very cheap setup to run our RabbitMQ tests against. We can download the tarball and then keep it in a known location in our machine. Then every time we run our test suit we can uncompress it, start the broker, run the tests and then stop the broker and erase the folder contents. Pretty easy.

I've implemented this using PHPUnit but I'm sure you can implement this with your favorite unit testing framework.

PHPUnit has a concept of test listeners that you can attach to your test suits. They will be invoked whenever the test suit runs and you can use them to do several stuff, in our case, we are going to start/stop RabbitMQ.

Here's how we set up a test listener in our XML configuration file:

<script src="https://gist.github.com/videlalvaro/5482952.js"></script>

There we specify our listener class, it's location in relation to the `phpunit.xml` file and we pass an argument to the listener with the location of the RabbitMQ tarball.

Our `RabbitMQListener` will take care of finding the tarball and uncompressing it into a temporary folder. Then it will start the broker and once it is started it will let the test suit continue running tests. For each test, it will reset the broker state so there are no queues or exchanges left overs between tests. Finally, when the test suite is over, it will shut down the broker and will proceed to delete the temporary folder contents.

Once we add the listener configuration to PHPUnit and we specify the right path to the new RabbitMQ tarball, we can run our tests by simply calling `phpunit` as we used to do.

The code for the listener class can be found here:

<script src="https://gist.github.com/videlalvaro/5482529.js"></script>

For the purposes of this blog post the whole listener code sits in one class, but I think one smart thing to do with that code would be to move the bits that manage RabbitMQ to a separate utils like class.

I hope this can be useful to you and let me know of any comments or improvements you'd like to see. Maybe once we can get this into a more generic class we can add it to `php-amqplib`. One interesting change to add will be the possibility to run the broker in a different port, and also a way to pass our test user credentials to the listener class so RabbitMQ can use those instead of the default `guest:guest`.

So go here and check out what's being cooked at the RabbitMQ labs: [http://www.rabbitmq.com/nightlies/rabbitmq-server/current/](http://www.rabbitmq.com/nightlies/rabbitmq-server/current/)