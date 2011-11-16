---
layout: post
title: The Future of php-amqplib
---

# {{page.title}} #

<span class="meta">November 16 2011</span>

Yesterday I moved the development of the `php-amqplib` from here [https://github.com/tnc/php-amqplib](https://github.com/tnc/php-amqplib) to here [https://github.com/tnc/php-amqplib](https://github.com/tnc/php-amqplib). This library started as a port from the repository hosted at [http://code.google.com/p/php-amqplib/](Google Code) since we wanted to use the library with PHP 5.3 and back then it was raising a lot of `E_STRICT` errors.

The code hosted at the __tnc__ account was used by `The NetCircle` in production so we decided to publish it back in Github. Since March I don't work there anymore so I kind of stopped contributing to that library except from merging the occasional pull request with bug fixes. Now I wanted to start again working in that library, adding tests and refactoring the code structure to a more modern style: separating classes in one file per class, getting rid of the `.inc` files and possibly introducing namespaces plus other improvements. Besides the code restructure I also integrated the library with [travis-ci.org](http://travis-ci.org/#!/videlalvaro/php-amqplib) so it can be continuously integrated in that platform. To be able to do that I needed to be admin of that repository but since I don't work anymore at TNC I thought the easiest way was to just fork the project _yet again_ and continue from there. This time since the forking happened in Github it's easier to track changes.

## Are you going to break everything then ##

Yes and No. I tagged the current stable version of master so you can still get a safe copy from here if you want: [v1.0 tag](https://github.com/videlalvaro/php-amqplib/zipball/v1.0).

## New Benchmarks ##

Since people kept asking me at conferences or over _the internet™_ about the speed of the library I wrote some small benchmarks that you can try by yourself on your machine. They are very simple but they can give you a baseline to see what to expect: [https://github.com/videlalvaro/php-amqplib/tree/master/benchmark](https://github.com/videlalvaro/php-amqplib/tree/master/benchmark).

In those benchmarks I could send/receive 1000 1kb msgs/sec on my 2010 Macbook Pro using `RabbitMQ 2.7.0`. Please share your results in the comments.

## Future ##

My plans for the future are:

* Improving the Class Structure: one class per file.
* Start using Namespaces.
* Add tests for the protocol related functions.
* Improve the code readability.
* Add better configuration for the AMQPConnection object.
* Improve performance when possible

Again please share your comments on what you want to see on the next versions of the library.