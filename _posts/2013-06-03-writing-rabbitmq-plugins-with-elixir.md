---
layout: post
title: Writing RabbitMQ Plugins With Elixig
---

# {{page.title}}

<span class="meta">June 3 2013</span>

RabbitMQ is a very extensible message broker, allowing its users to extend the server functionality by writing plugins. Even many of the broker features are shipped as plugins that come by default with the broker installation: [The Management Plugin](http://www.rabbitmq.com/management.html), or [STOMP](https://www.rabbitmq.com/stomp.html) support, to name just a couple. While that's pretty cool, the fact that plugins must be written in Erlang is sometimes in itself a challenge. I decided to see if it was possible to write plugins in another language that targeted the Erlang Virtual Machine (EVM) and in this post I'd share my progress.

## Elixir

In the last couple of months I've been paying attention to a new programming language called [_Elixir_](http://elixir-lang.org) that targets the EVM and in the last week it became immensely popular inside the Erlang community (and outer circles) since [Joe Armstrong](https://twitter.com/joeerl), the father of Erlang, [tried the language](http://elixir-lang.org), and liked it very much. So I said, OK, lets give it a try.

I don't want to spend much time describing that Elixir is, it's better if you read its website or Joe Armstrong blog post about it. For me it brings ideas from the Ruby Language into the Erlang platform. We can basically write Erlang programs with an arguable better syntax, for some definition of better syntax.

Compare this Erlang Hello World program:

{% highlight erlang %}
-module(module_name).  % you may use some other name
-compile(export_all).

hello() ->
  io:format("~s~n", ["Hello world!"]).
{% endhighlight %}

With this one in Elixir:

{% highlight elixir %}
  # module_name.ex
  defmodule ModuleName do
    def hello do
      IO.puts "Hello World"
    end
  end
{% endhighlight %}

While yes, this example is quite trivial, I think for someone that has never seen Erlang syntax, the Elixir version is easier to read. From my point of view, I always liked Erlang's syntax, since it makes the semantic of Erlang concepts stand up and be very clear of what's going on, but again, that's my own point of view.

Now considering that people might prefer to write RabbitMQ plugins with Elixir, let's see how that could be done

## Writing RabbitMQ Plugins

To write plugins for RabbitMQ you will need to setup your development environment to use the tools, Makefiles and libraries provided by the _rabbitmq public umbrella_. You can follow the setup instructions from [here](http://www.rabbitmq.com/plugin-development.html). Once you have cloned the `http://hg.rabbitmq.com/rabbitmq-public-umbrella` project and have all the dependencies installed, we can start writing our own plugin. To do it with Elixir, you first need to install it on your machine, so you can use the Elixir compiler `mix` and the language libraries.

When you write RabbitMQ plugins you may want to use some Erlang library with your plugin, to do that you need to _wrap it_ as a plugin as well, so it can be picked up by the build environment when you declare that library as a dependency of your project. In this case our new plugins will depend on Elixir, so we need to wrap the language libraries as a plugin. I've done that already and you can just clone the [elixir_wrapper](https://github.com/videlalvaro/elixir_wrapper) from Github and follow the instructions on its README to get it installed.

Now is time to create our own plugin. As an example I've ported to Elixir a plugin called _recent-history-exchange_ that as the name implies, it adds a new exchange type to RabbitMQ. Exchanges are routing algorithms that RabbitMQ uses to decide where your messages are going to end up. If you want to read more about exchanges please go [here](http://www.rabbitmq.com/tutorials/amqp-concepts.html).

The code for the new exchange can be found on github: [RabbitMQ Recent History Exchange](https://github.com/videlalvaro/rabbitmq-recent-history-exchange-elixir).

The code for the new exchange type lives inside the file `lib/rabbit_exchange_type_recent_history.ex`, where we implement the `rabbit_exchange_type` behaviour. The overridden methods are: `route/2`, `delete/3` and `add_binding`. What this exchange does is to cache the last 20 messages while they are routed to queues. Whenever a new queue is bound to the exchange, then we deliver those last 20 messages to it. Finally whenever the exchange is deleted we remove its entries from the database. When is this useful? Say you implement a chat with RabbitMQ and you want that people that join the room get the last messages sent to the room. This is a simple way to accomplish that.

While you could understand most of the code there if you first follow an [Elixir Tutorial](http://elixir-lang.org/getting_started/1.html) there are some points worth noting since for me it was not so clear on how to port them into Elixir. To take a look at what was the original project I was porting from Erlang take look at the project [here](http://elixir-lang.org/getting_started/1.html).

### Module Attributes

RabbitMQ uses a concept of _boot steps_ in order to start the broker. Those boot steps are scanned when the broker starts and from there plugins are automatically picked up by the server. They are declared as module attributes, so my first blocker was how to add a module attribute to Elixir. Assuming we have the following module:

{% highlight elixir %}
defmodule RabbitExchangeTypeRecentHistory do
end
{% endhighlight %}

To add an attribute to it like the ones expected by RabbitMQ we have to do like this:

{% highlight elixir %}
defmodule RabbitExchangeTypeRecentHistory do

  Module.register_attribute __MODULE__,
       :rabbit_boot_step,
       accumulate: true, persist: true

  @rabbit_boot_step { __MODULE__,
                     [{:description, "exchange type x-recent-history"},
                      {:mfa, {:rabbit_registry, :register,
                              [:exchange, <<"x-recent-history">>, __MODULE__]}},
                      {:requires, :rabbit_registry},
                      {:enables, :kernel_ready}]
end
{% endhighlight %}

First we have to register our attribute by calling `Module.register_attribute` and then we can use them in our code as in this example.

### Behaviours

Declaring behaviours in our modules is quite easy. We just need to add a behaviour attribute to our module like this:

{% highlight elixir %}
  @behaviour :rabbit_exchange_type
{% endhighlight %}

### Erlang Records

When you develop RabbitMQ plugins and probably whenever you interop with Erlang libraries you will need to use the records defined in the library. This isn't as straightforward as I was expecting. We have to import the record definitions into Elixir, for example, to have the `#exchange` record from RabbitMQ we have to do like this:

{% highlight elixir %}
defmodule RabbitExchangeTypeRecentHistory do  
  defrecord :exchange, Record.extract(:exchange, from_lib: "rabbit_common/include/rabbit.hrl")
end
{% endhighlight %}

Keep in mind that here I'm just placing snippets of the code. You don't need to define the `RabbitExchangeTypeRecentHistory` module every time.

## Building the Plugin

Once we finished implementing our plugin we might want to build it, after all there's a reason why we spent all this time on it. To do so we need to add two `Makefiles` files into our project folder in order to integrate it with RabbitMQ's build system.

The first is called `Makefile` and it includes just one line:

{% highlight make %}
include ../umbrella.mk
{% endhighlight %}

The second one is a bit more involved. Here we specify the dependencies of our project and we tell the rabbitmq build system how to compile our Elixir code.

{% highlight make %}
DEPS:=rabbitmq-server rabbitmq-erlang-client elixir_wrapper
RETAIN_ORIGINAL_VERSION:=true
ORIGINAL_VERSION:=0.1
DO_NOT_GENERATE_APP_FILE:=

CONSTRUCT_APP_PREREQS:=mix-compile
define construct_app_commands
	mkdir -p $(APP_DIR)/ebin
	cp $(PACKAGE_DIR)/ebin/* $(APP_DIR)/ebin
endef

define package_rules

$(PACKAGE_DIR)/deps/.done:
	rm -rf $$(@D)
	mkdir -p $$(@D)
	@echo [elided] unzip ezs
	@cd $$(@D) && $$(foreach EZ,$$(wildcard $(PACKAGE_DIR)/build/dep-ezs/*.ez),unzip -q $$(abspath $$(EZ)) &&) :
	touch $$@

mix-compile: $(PACKAGE_DIR)/deps/.done
	mix clean
	ERL_LIBS=$(PACKAGE_DIR)/deps mix compile

endef
{% endhighlight %}

I won't explain this code line by line, but just the remarkable bits. On the first line we declare our plugin's dependencies. In this case we depend on the `rabbitmq server` and the `rabbitmq-erlang-client` in order to have access to all the behaviours and records required by our plugin. Of course we also depend on the Elixir libraries to be shipped with our plugin.

Then we define some make targets to compile our plugin and package it inside an `.ez` file. (RabbitMQ plugins are shipped as .ez files). The `mix-compile` target will as the name says, build our Elixir code. As you might have noticed it sets the `ERL_LIBS` variable our plugin `./deps` folder. For that to work we first need to have the dependencies unpacked there, therefore the make rule `$(PACKAGE_DIR)/deps/.done`, which will unpack into that folder the previously built dependencies.

Finally our `define construct_app_commands` will copy our `.beam` files into the destination folder so the rabbitmq build system will be able to find them and ship them inside our plugin `.ez` file.

Once we have everything in place it's time to actually build our plugin. We can do so by simply calling `make` inside the plugin folder.

Once the build process has finished, we can find the `.ez` files inside the `dist` folder

{% highlight bash %}
ls dist/
amqp_client-3.3.1.ez                                     elixir-0.9.2.dev-rmq3.3.1-git7c379aa.ez                  rabbit_common-3.3.1.ez                                   rabbitmq_recent_history_exchange_elixir-0.1-rmq3.3.1.ez
{% endhighlight %}

From those files we only need to distribute `rabbitmq_recent_history_exchange_elixir-0.1-rmq3.3.1.ez` and `elixir-0.9.2.dev-rmq3.3.1-git7c379aa.ez` as part of our plugin.

## Installing the Plugin

Copy the files `rabbitmq_recent_history_exchange_elixir-0.1-rmq3.3.1.ez` and `elixir-0.9.2.dev-rmq3.3.1-git7c379aa.ez` into the `plugins` folder of your RabbitMQ installation and then activate the plugin by calling: `/sbin/rabbitmq-plugins enable rabbitmq_recent_history_exchange_elixir`.

Once we start the broker we can see in the management interface that we can add exchanges of the type `x-recent-history`.

![More than 7000~ visits in one day](/images/rh_exchange.png)

## Coda

And that's that. We can build RabbitMQ plugins using Elixir, most the _yak shaving_ is done already we just need to use the `elixir_wrapper` and create the proper `package.mk` file for our plugin. From there it's just a matter of invoking `make`. Let me know what do you think and if you build a RabbitMQ plugin using Elixir please share it and let me know.