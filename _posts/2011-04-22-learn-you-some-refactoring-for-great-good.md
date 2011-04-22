---
layout: post
title: Lear You Some Refactoring For Great Good
---

# {{page.title}} #

<span class="meta">April 21 2011</span>

The last few days I had to refactor a class of 3600+ LoC… I don't want to go into the details of how painful is to accomplish such thing with a language like PHP that lacks a type system ala Haskell. What I would like to talk about are some coding *practices* I've found that I thought they where part of the past.

## Objects with a purpose ##

Objects shouldn't be modeled like swiss army knives. Period. They need to have a specific purpose, and that purpose is what the class name should convey.

Imagine you have the following class:

{% highlight php %}

class Logger {
  // omitted code
  public function log($msg) {
    // omitted code
  }

  public function sendMail($from, to, $body) {
    // omitted code
  }

  // omitted code
}

{% endhighlight %}

Now can you tell me why on earth a class called *Logger* is sending emails? Can you? I can't? The very name *Logger* tells you what this class should do and guess what _that_ is, *log* messages. We can argue to see if this class should manage the file handle were to write the logs, or if it should be provided to it in some form of composite. We can argue if this class should implement formatter functions for the logs or if it should allow several formatters injected as composites. Still, I don't think this class should be sending emails.

Code examples like this one can be found everywhere. I've found myself many times adding methods to classes that had nothing to do with what the method was doing.

## Conditionals and State ##

Another piece of code that smells bad are boolean conditions that depend on the object internal state. And I'm not referring here to the object reacting differently to the status of a database handle for example. So you would have code like this:

{% highlight php %}

public function execute($sql) {
  if($this->dbHandle) {
    //do something with the dbHandle and the SQL query
  }
}

{% endhighlight %}

I don't have problem with such code. My problem comes when some method behavior depends entirely on the state of some object flags that can be changed from anywhere in the inheritance chain:

{% highlight php %}

class SomeClass {
  public function someMethod($foo, $bar) {
    if($this->quux && $this->baz['key']) {
      //
    } else {
      //
    }
  }
}

{% endhighlight %}

Why do I have to be tracking down what `$this->quux` and `$this->baz['key']` could be at run time to see what this function is going to do? Also imagine that the method `someMethod` was our `sendMail` method from the example above and you would like to refactor it out to a new class that you want to use as a composite. You will have to see what `$this->quux` and `$this->baz['key']` mean for the entirety of the code that uses `SomeClass` to be able to refactor it. That's not nice. That's not easy to do, and is pretty hard to get it right. Even more with a language like PHP that is dynamically typed.

Take a look at [Referential Transparency](http://bit.ly/fuzaUw). If you want your code to be *unit-testable*, then separating your stateful computations from those that don't depend on state (AKA pure code) will really help you to achieve such goal.

As it is said many times, you don't need to be coding in Haskell to use its concepts in your daily language.

## Lack of Types doesn't mean a duck is a chicken ##

Talking about PHP being dynamically typed it seems that sometime people forget what types are or what they mean semantically. See this code:

{% highlight php %}
class OtherClass
  public function __construct($dbHandle, $logger) {
    $this->dbHandle = $dbHandle;
    $this->logger = $logger;
  }
}
{% endhighlight %}

So far nothing fancy, but…

I saw some code like that being called in this way:

{% highlight php %}
$v = new OtherClass(false, new Logger());
{% endhighlight %}

The problem with such code is that the absence of a `$dbHandle` is being represented with the _boolean_ *false*. Booleans purpose, whether your language is statically typed or not, is to represent values that have some sense of "truthiness" on them i.e.: True & False –ORLY?–.

So when people go so crazy about semantic HTML, regarding the use of proper tags for the proper markup, I wonder why they also don't go so crazy about using the proper types for the proper values. In the case of PHP I would have used `null` to represent the absence of a `$dbHandle`, but not `false`. SQL has this distinction too with the NULL value and the checks for `IS NULL` for example.

Why does all this matters? Because when I read such code and I see a `false` as first argument I'm left wondering what happens if I pass `true` there. After inspecting the code I know what happens… the code will simply blow up. See the example on top where I do `if($this->dbHandle)`. The code will try to execute a query on a `true` value. It's a very small detail, but a detail that improves code readability and intent.

## Exceptions or Null or Booleans or… ##

What happens when a *C* style developer learns *Java*? You get a function that returns `booleans`, `nulls` and also throws exceptions to signal failures. This kind of APIs really drive me crazy. I can never know what I will get back when calling such functions. One of the principles of good encapsulation is that as a user of an API I shouldn't care about what's happening inside functions.

## What can we do? ##

Something that has really helped me to improve the way I code is Functional Programming. Sadly when I talked to peers about it I often see that people think of Functional Programming as some academic exercise even despite so [many](http://www.haskell.org/haskellwiki/Haskell_in_industry) [examples](http://www.ejabberd.im/) of [successful](http://www.franz.com/success/customer_apps/animation_graphics/nichimen.lhtml) [projects](http://rabbitmq.com/) [written](http://www.basho.com/products_riak_overview.php) using Functional Languages.

If you practice Functional Programming in a language like Haskell that forces you to separate pure code from the impure one you will get used on writing functions that depend entirely on the parameters they accept. And that's just the beginning of it.

So the advice you didn't ask for is: learn Functional Programming. You can start [here](http://learnyouahaskell.com/)