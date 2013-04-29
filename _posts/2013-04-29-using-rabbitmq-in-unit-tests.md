---
layout: post
title: Using RabbitMQ in Unit Tests
---

# {{page.title}}

<span class="meta">April 29 2013</span>

In this blog post I want to show you a very simple technique for using RabbitMQ in our Unit or Functional Tests. Let's say you wrote a bunch of tests for your RabbitMQ consumers and then it's time to run them. To do that you probably need to setup a RabbitMQ server just for tests with their own users and passwords, or you need to set up a whole new virtual host for your tests. While that task is not that hard to accomplish, you might need to install RabbitMQ and Erlang in order to get the broker running.

With a future release of RabbitMQ that we can already test on the [nightlies website](http://www.rabbitmq.com/nightlies/rabbitmq-server/current/), we can run RabbitMQ without the need to install Erlang. We created a package that ships a stripped down version of Erlang together with the broker bits, so running RabbitMQ now is as easy as downloading a tarball, uncompressing it and starting the server. It's worth noting that this works only on Mac for now, but we plan to extend it for other platforms soon.

The tarball is called `rabbitmq-server-mac-standalone-3.0.4.XYZ.tar.gz` where XYZ is the current build version. At the time of this writing this is the current tarball [http://www.rabbitmq.com/nightlies/rabbitmq-server/current/rabbitmq-server-mac-standalone-3.0.4.40426.tar.gz](http://www.rabbitmq.com/nightlies/rabbitmq-server/current/rabbitmq-server-mac-standalone-3.0.4.40426.tar.gz).

The cool thing about that tarball is that we can use it as a very cheap setup to run our RabbitMQ tests against. We can download the tarball and then keep it in a known location in our machine. Then every time we run our test suite we can uncompress it, start the broker, run the tests and then stop the broker and erase the folder contents. Pretty easy.

I've implemented that using PHPUnit but I'm sure you can implement it with your favorite unit testing framework.

PHPUnit has a concept of test listeners that you can attach to your test suites. They will be invoked whenever the test suite runs and you can use them to do several stuff, in our case, we are going to start/stop RabbitMQ.

Here's how we set up a test listener in our XML configuration file:

{% highlight xml %}
<listeners>
    <listener class="RabbitMQListener" file="PhpAmqpLib/Tests/RabbitMQListener.php">
        <arguments>
            <string>/tmp/rabbitmq-server-mac-standalone-3.0.4.40426.tar.gz</string>
        </arguments>
    </listener>
</listeners>
{% endhighlight %}

There we specify our listener class, it's location in relation to the `phpunit.xml` file and we pass an argument to the listener with the location of the RabbitMQ tarball.

Our `RabbitMQListener` will take care of finding the tarball and uncompressing it into a temporary folder. Then it will start the broker and once it is started it will let the test suite continue running tests. For each test, it will reset the broker state so there are no queues or exchanges leftovers between tests. Finally, when the test suite is over, it will shut down the broker and will proceed to delete the temporary folder contents.

Once we add the listener configuration to PHPUnit and we specify the right path to the new RabbitMQ tarball, we can run our tests by simply calling `phpunit` as we used to do.

Here's the code for the PHPUnit listener class:

{% highlight php %}
<?php

class RabbitMQListener implements PHPUnit_Framework_TestListener 
{
    protected $tmp_dir;
    protected $rabbit_base;
    protected $rabbit_tar;
    protected $rabbit_pid;

    public function __construct($rabbit_tar) 
    {
        $this->rabbit_tar = $rabbit_tar;
        $this->tmp_dir = sys_get_temp_dir();

        $this->extractRabbitMQ($this->rabbit_tar, $this->tmp_dir);

        $rabbit_dir = $this->getRabbitMQDir($this->rabbit_tar);

        if (strlen($rabbit_dir) > 0) {
            $this->rabbit_base = $this->tmp_dir . '/' . $rabbit_dir;
        } else {
            exit(1);
        }

        $this->rabbit_pid = $this->rabbit_base . 'var/lib/rabbitmq/rabbitmq.pid';

        $this->createRabbitConf($this->rabbit_base, $this->rabbit_pid);

        $this->startRabbitMQ($this->rabbit_base);

        if (!$this->isRabbitMQRunning($this->rabbit_base, $this->rabbit_pid)) {
            exit(1);
        }
    }

    public function __destruct()
    {
        $this->stopRabbitMQ($this->rabbit_base, $this->rabbit_pid);
        $this->clearRabbitMQDir($this->rabbit_base);

        $this->maybeStopEpmd($this->rabbit_base);
    }

    protected function maybeStopEpmd($rabbit_base)
    {
        exec('ps ax | grep epmd | grep -v grep', $out);

        if (isset($out[0]) && strstr($out[0], $rabbit_base)) {
            exec('epmd -kill');
        }
    }

    public function startTestSuite(PHPUnit_Framework_TestSuite $suite)
    {
        $this->resetRabbitMQ($this->rabbit_base);
    }

    protected function resetRabbitMQ($rabbit_base)
    {
        exec($rabbit_base . 'sbin/rabbitmqctl stop_app');
        exec($rabbit_base . 'sbin/rabbitmqctl reset');
        exec($rabbit_base . 'sbin/rabbitmqctl start_app');
    }

    protected function extractRabbitMQ($rabbit_tar, $tmp_dir)
    {
        $tar_extract_cmd = 'tar -xzf ' . $rabbit_tar . ' -C ' . $tmp_dir;
        exec($tar_extract_cmd);
    }

    protected function getRabbitMQDir($rabbit_tar)
    {
        $tar_dir_cmd = 'tar --exclude="*/*/*" -tf ' . $rabbit_tar;
        exec($tar_dir_cmd, $dir_out);

        return isset($dir_out[0]) ? $dir_out[0] : "";
    }

    protected function createRabbitConf($rabbit_base, $rabbit_pid)
    {
        $rabbit_conf_dir = $rabbit_base . 'etc/rabbitmq/';
        $rabbit_conf = $rabbit_conf_dir . 'rabbitmq-env.conf';
        $conf = sprintf('RABBITMQ_PID_FILE="%s"%s', $rabbit_pid, "\n");

        file_put_contents($rabbit_conf, $conf);
    }

    protected function startRabbitMQ($rabbit_base)
    {
        exec($rabbit_base . 'sbin/rabbitmq-server > /dev/null 2>&1 &');
    }

    protected function waitForRabbitMQ($rabbit_base, $rabbit_pid)
    {
        exec($rabbit_base . 'sbin/rabbitmqctl wait ' . $rabbit_pid, $output, $return_val);
        return $return_val;
    }

    protected function isRabbitMQRunning($rabbit_base, $rabbit_pid)
    {
        return $this->waitForRabbitMQ($rabbit_base, $rabbit_pid) === 0;
    }

    protected function stopRabbitMQ($rabbit_base, $rabbit_pid)
    {
        exec($rabbit_base . 'sbin/rabbitmqctl stop ' . $rabbit_pid);
    }

    protected function removePid($rabbit_pid)
    {
        exec('rm ' . $rabbit_pid);
    }

    protected function clearRabbitMQDir($rabbit_base)
    {
        exec('rm -rf ' . $rabbit_base);
    }

    public function endTestSuite(PHPUnit_Framework_TestSuite $suite)
    {}

    public function addError(PHPUnit_Framework_Test $test, Exception $e, $time)
    {}

    public function addFailure(PHPUnit_Framework_Test $test, PHPUnit_Framework_AssertionFailedError $e, $time)
    {}

    public function addIncompleteTest(PHPUnit_Framework_Test $test, Exception $e, $time)
    {}

    public function addSkippedTest(PHPUnit_Framework_Test $test, Exception $e, $time)
    {}

    public function startTest(PHPUnit_Framework_Test $test)
    {}

    public function endTest(PHPUnit_Framework_Test $test, $time)
    {}
}
{% endhighlight %}

For the purposes of this blog post the whole listener code sits in one class, but I think one smart thing to do with that code would be to move the bits that manage RabbitMQ to a separate utils-like class.

I hope this can be useful to you and let me know about any improvements you'd like to see. Maybe once we can get this into a more generic class we can add it to `php-amqplib`. One interesting change to add will be the possibility to run the broker in a different port, and also a way to pass our test user credentials to the listener class so RabbitMQ can use those instead of the default `guest:guest`.

So go here and check out what's being cooked at the RabbitMQ labs: [http://www.rabbitmq.com/nightlies/rabbitmq-server/current/](http://www.rabbitmq.com/nightlies/rabbitmq-server/current/).

NOTE: If you have Erlang installed you can do the same by using the [generic-unix tarball](http://www.rabbitmq.com/releases/rabbitmq-server/v3.0.4/rabbitmq-server-generic-unix-3.0.4.tar.gz).