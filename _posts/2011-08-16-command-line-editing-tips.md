---
layout: post
title: Command Line Editing Tips
---

# {{page.title}} #

<span class="meta">August 16 2011</span>

## Background ##

Back when I was in Shanghai I saw one of our chinese colleagues to be able to work really fast on the command line. By really fast I don't mean fast typing but fast edition of commands. He could jump around his cursor over the line and move words here and there with ease. Perhaps you are an advanced CLI user but in my case I've got really impressed by that. Of course I asked what was his *secret*. **Emacs** he said, plain and old Emacs.

So what does Emacs has to do with all this speed? The _key_ is in the key bindings that you have to use while editing with Emacs. After I learned some of them I also found out that most applications also support them. Yes even your browser supports the Emacs key bindings. Not that I'm discovering powder but yes, for me most of this was new.

In this post I want to show you how to edit the text that you entered on the CLI, how to move text around, copy paste it and so on all by using default keyboard shortcuts. Some of this keyboard shortcuts should work on your Terminal and in some of your other applications like Mail or Safari as well. Keep in mind that I've only tested this on my Mac using the default shell.

## Fast command edition ##

If you are working on the mac Terminal the first thing you should do is set it up properly so it can understand the _Meta Key_ or _Alt_. As you know the _Alt_ key is used in the Mac to enter special characters. In the Terminal that's not so useful so you can convert it to be the _Meta_ key. Press `command+,` or simply go to _Preferences_ and check the _Use option as meta key_ checkbox at the bottom of the _Keyboard_ tab. Once you got that you are ready to go.

![RPC Over RabbitMQ](/images/meta-key.png)

As a convention the _ctrl_ key is always abbreviated _C_ and the _alt_ or _Meta_ key is always abbreviated _M_ so the combination of pressing ctrl and `e` together will be: `C-e`.

I think the most well know Emacs shortcuts probably are those to go to the beginning or the end of the line. So say you typed the following command:

{% highlight sh %}
  $ mv ./path/to/soem/file.txt ./path/to/soem/file_1.txt
{% endhighlight %}

And you want to move to the begging of the line. The you can do so by pressing `C-a`. If you want to return to the end of the line just press `C-e`. Pretty easy.

Now, there's a typo there, the folder shouldn't be _soem_ but _some_. How can you quickly jump to the _soem_ and edit that word? Press `C-a` to go to the begging of the line. Then press `M-f` to jump **f**orward from word to word. You can also do `M-b` to jump **b**ackwards. If instead of doing `M-f` you try `C-f` or `C-b` then the cursor will move character by character but in my case I'm used to just using the arrow keys for that.

If you are at the beginning of the word _soem_ you can press `M-d` to **d**elete it and then you can type the corrected version.

After you edited the line in both places you have something like this:

{% highlight sh %}
  $ mv ./path/to/some/file.txt ./path/to/some/file_1.txt
{% endhighlight %}

Now we realize that we want to swap source an destination since we made a mistake there. How can we do that without typing everything again? First place the cursor at the beginning of the second argument and type `C-k` to _kill_ everything till the end of the line. You will end with something like:

{% highlight sh %}
  $ mv ./path/to/soem/file.txt
{% endhighlight %}

Then press `C-a` to go to the beginning of the line followed by `M-f` to move forward from the `mv` command and after pressing `SPACE` type `C-y` to **y**ank (paste) the text that you killed before. You should end with something like:

{% highlight sh %}
  $ mv ./path/to/some/file_1.txt ./path/to/some/file.txt
{% endhighlight %}

Let's open the file to see its contents:

{% highlight sh %}
  $ open ./path/to/some/file.txt
{% endhighlight %}

Once we see the content is irrelevant and that we can delete the file we can do so by going to the previous command in the history using `C-p` for example so we see again:

{% highlight sh %}
  $ open ./path/to/some/file.txt
{% endhighlight %}

Now type `M-d` to delete the `open` command, and type `rm` and that's it. Pretty basic but there we go another way of using these key bindings so we don't have to type all over again.

An interesting feature is the _kill ring_ where all (well almost all) the text that you have killed before in the session is available. So after you _yank_ some text you can then press `M-y` to cycle through that text.

What's cool about these keyboard bindings is that if you use Emacs you already know them because they are some sort of standard in *nix software. Start for example a `mysql` console and enter the following query:

{highlight sql %}
SELECT a b c FORM the_table WHERE a=1;
{% endhighlight %}

Try using the keyboard shortcuts to fix the mistyped `FROM`: It just works! It will also work with your Erlang REPL and Haskell GHCi.

I know this has been working like this since ages but somehow I felt the need to document it. You can also try some of these key bindings on most native text boxes on the Mac.

## Summary ##

`C-a`: jumps to the beginning of the line.
`C-e`: jumps to the end of the line.
`M-f`: moves forward word by word.
`M-b`: moves backwards word by word.
`C-k`: kills text till the end of the line.
`C-y`: yanks previously killed text.
`M-y`: cycles through the _kill ring_.

I hope this results in improved command line editing for your future CLI usage.
