---
layout: post
title: Command Line Editing Tips
---

# {{page.title}} #

<span class="meta">August 16 2011</span>

Back when I was in Shanghai I saw one of our chinese colleagues to be able to work really fast on the command line. By really fast I don't mean fast typing but fast edition of commands. He could jump around his cursor over the line and move words here and there with ease. Perhaps you are an advanced CLI user but in my case I've got really impressed by that. Of course I asked what was his *secret*. **Emacs** he said, plain and old Emacs.

So what does Emacs has to do with all this speed? The _key_ is in the key bindings that you have to use while editing with Emacs. After I learned some of them I also found out that most applications also support them. Yes even your browser supports the Emacs key bindings. Not that I'm discovering powder but yes, for me most of this was new.

In this post I want to show you how to edit the text that you entered on the CLI, how to move text around, copy paste it and so on all by using default keyboard shortcuts. Some of this keyboard shortcuts should work on your Terminal and in some of your other applications like Mail or Safari as well. Keep in mind that I've only tested this on my Mac using the default shell.

## Fast command edition ##

If you are working on the mac Terminal the first thing you should do is set it up properly so it can understand the _Meta Key_ or _Alt_. As you know the _Alt_ key is used in the Mac to enter special characters. In the Terminal that's not so useful so you can convert it to be the _Meta_ key. Press `command+,` or simply go to _Preferences_ and check the _Use option as meta key_ checkbox at the bottom of the _Keyboard_ tab. Once you got that you are ready to go.

![RPC Over RabbitMQ](/images/meta-key.png)

As a convention the _ctrl_ key is always abbreviated _C_ and the _alt_ or _Meta_ key is always abbreviated _M_ so the combination of pressing ctrl and `e` together will be: `C-e`.

I think the most well know Emacs shortcuts probably are those to go to the beginning or the end of the line. So say you typed the following command:

