---
layout: post
title: On Contributing to Open Source
---

# {{page.title}} #

<span class="meta">August 29 2014</span>

The other day I was reading
[a blog post in Spanish](http://symfony.es/noticias/2014/07/24/los-errores-de-la-pagina-28/)
where it was discussed how people and companies contribute to open
source. Many people shared their views in the comments section, on why
to collaborate, why not to collaborate, about why some certifications
should be cheaper, about rewards to contributors and what not. The
whole discussion prompted me to write this blog post, sharing what I
think one could do in order to contribute back to the open source
community, both as an individual or as a company.

In my particular case, I have benefited greatly from open source. In
fact, I think I wouldn't be where I am today in my career if it weren't
for open source. I remember back in the days starting with PHP and
Apache to create my first web page. Open source allowed me to find
source code written by others, read it, and learn how to do my
things. My first iteration over a database result-set was probably some
copy pasted code that I found online somewhere on the internet. But
that's not all. Later in my career, once I had got a job as a
programmer, I found myself getting interested in Symfony, being
probably one of the first users in Uruguay developing a project for a
company using the framework. The involvement with Symfony led me to
find my job in Shanghai, where I moved with my wife, over 6 years ago.

Open source then led me to learn many other things, the most salient
of those was probably Erlang and in turn RabbitMQ. My involvement with
that community led me to end up writing a book about it, presenting
at numerous conferences around the world explaining what RabbitMQ is,
and why it was great using it. Once the book got published, I even got
an offer from VMware to work for them as part of the Cloud Foundry and
the RabbitMQ teams. So I can say that open source has really helped in
my career. With that out of the way, let's see how I think we can
contribute to open source.

The most obvious way to contribute to open source is by contributing
code. __you\_dont\_say.gif__. This of course requires that we know
about the internals of the project where we are trying to contribute,
so perhaps fixing a little bug can turn into a big challenge. At the
same time this presents a great opportunity for us for learning about
technology X in more detail, so there are two sides to the
story. Another problem this might have are projects that have very high
requirements in order to send some code back. For example, Erlang has
a very
[strict set of requirements](https://github.com/erlang/otp/wiki/submitting-patches)
that at the beginning might look like a burden. _I just wanted to fix
issue X_. On the other hand, if we follow them, we might actually
learn a lot. For me fixing a little bug for Erlang was quite the
experience, trying to follow their guidelines, and even learning about
how to use git in order to send my PR. On the other hand, I must
confess that I was really happy when my name appeared in the release
notes.

Another problem is that there are projects that have the source out
there, but they aren't really quite _open source_, in the sense that
their authors don't accept contributions, or they use a very arcane
VCS that doesn't work in our platform, or for which we don't have any
interest in learning. I remember having some things I wanted to
contribute back to [Graphite](http://graphite.wikidot.com), but their
use of [Bazaar](http://bazaar.canonical.com/en/) put me down.

Then there's time, some say it's our only resource. Another reason why
we might not be able to contribute is just because we don't have the
time to do it. Probably sharing time with our family/friends seems
more rewarding than trying to send a patch back to a project, and who
is going to blame us for that?

Related to the time issue, there are companies that don't let their
programmers spend time on external projects. I think this is not
good. Those companies are usually taking a big advantage from the code
written by others, but then they don't let their developers to
contribute back. I'm quite happy to say that the companies where I had
worked didn't have that problem, on the contrary, they motivated
employees to contribute back to open source.

Something to take into account when sending code contributions is, as
someone said on Twitter, that we are giving the project maintainer some
more code to be responsible for. Sometimes we send a 20 lines of code
pull request, it gets merged, and we forget about the issue. That's
not the case for the project maintainer. They have to live with our
changes for ever.

Also if we don't want to send PRs to other projects, maybe we can
create a satellite project that helps users of project X. For example,
while using Symfony at [The NetCircle](http://www.thenetcircle.com) we
created a couple of libraries to facilitate using Propel, Memcached
and some other things with Symfony. In my case I started maintaining
libraries to access
[RabbitMQ from PHP](https://github.com/videlalvaro/php-amqplib), just
to name an example.

## Beyond the Code ##

So let's say contributing code is out of the question. What else could
we do if we wanted to give back to the open source community?

We can write documentation, all kinds of it. Whether it is actually
improving the project guides or tutorials, if any, or writing your own
blog posts. You spent a day trying to figure out how to run RabbitMQ
on EC2? Why not write about it? Why not share it back with the
community? You don't have a blog of your own? Well, why not ask the
project maintainers to publish your guide in their blog. I remember
sending articles to Fabien Potencier about Symfony that he kindly
published in the framework's official blog. At the same time, some
people might engage with our blog posts, even correcting our mistakes,
or showing us better ways of doing things, and we will all benefit
from it.

Related to writing docs, is actually taking part in discussions inside
the community, like being part of a mailing list or IRC channels. Many
people resort to mailing lists in order to paste some code and wait
for an answer to their problems. We could position ourselves on the
other end of the food chain and be the person actually answering
questions. We don't need to answer every question, we could
participate from time to time and that will be fine too. Even if our
contributions are small, think that one answer we give on a mailing
list, or on stack overflow could potentially save a wasted day from
other's people time. Here I come back to companies that don't want to
contribute to the community. Don't they realize that some volunteer on
a mailing list, just saved one of their developers a day of work?

What about conferences? There are tons of conferences and user groups
around the world. We can contribute to project X by just submitting a
talk on a project we have experience and know about, and then help
others understanding how to use it. Depending on the conference, you
could even be invited to travel to another country, including plane
tickets and paid hotel. Not to mention that you will make friends and
meet other like minded people. If you think about your career, you
will be putting your name out there, perhaps at some point even
getting an invitation for a new job opportunity.

We don't need to speak at conferences if we are shy or simply don't
want to do it. We could also organize our own, from a local meetup to
a full conference. I know a lot of friends that organize conferences
as a way to contribute back to the community they are in.

## Gimme the money ##

Another obvious way is to actually contribute to the project with
money. Developers working in open source usually have to eat as
well. Some companies decide to donate to the actual project, or pay to
prioritize certain features. Then there are companies that pay for the
whole development of a project, by employing the core team of a
project for example.

Also from the financial side, what some companies do is to sponsor a
workshop for the community. Last year
[Shuttle Cloud](http://shuttlecloud.com) sponsored a RabbitMQ workshop
in Madrid, by covering my hotel and flight costs so I could deliver
the workshop. They also provided food for the attendees and took care
of the logistics for getting a room, projector and so on. Why did they
do that? Their team was working hard on their product, so they didn't
have much time for contributing to open source, but on the other hand
they felt they were getting a lot from open source, so they decided
that hosting the workshop was their way of giving back. BTW, if you
want to host a RabbitMQ workshop in your city, get in touch with me.

## What's rewarding about contributing to open source? ##

I listed some of the ways we could contribute to open source, whether
as a company or as individuals. Now I want to share one of the reasons
why I think it's great doing it. From my point of view (probably a
very hippie one) at the end of the day what matters is that behind
many people working in the industry, there's a father or a mother that
needs to bring food to their table. For example, one day in China, at
a conference, a group of developers approached me and asked me to take
a group picture with them. The reason? One of my open source libraries
helped them release their product and their boss was really happy with
them and their performance. For me, seeing them so happy there, made
my day, and certainly made me happy about having contributed to that
library. Many times I find people that tell me that my book helped
them do their jobs. For me that's what matters, to know that at least
for a second, someone's life got a little bit easier (end of hippie
rant).
