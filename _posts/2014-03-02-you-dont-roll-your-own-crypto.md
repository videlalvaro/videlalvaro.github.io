---
layout: post
title: You don't roll your own crypto
---

# {{page.title}} #

<span class="meta">March 2 2014</span>

Imagine you enter a contest organized by the [National Institute for Standards and Technology](http://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) (NIST),
where the goal is to design a new encryption standard to replace [DES](http://en.wikipedia.org/wiki/Data_Encryption_Standard) and [Triple-DES](http://en.wikipedia.org/wiki/Triple_DES).
Some of the contestants? The RSA, IBM, Deutsche Telekom and Counterpane (a team lead by Bruce Schneier). Would you think you stand a chance of winning? I know I wouldn't, but a Belgian team
composed by Joan Daemen and Vincent Rijmen beat the other teams with their submission: Rijndael, the system that was later to be come the new Advanced Encryption Standard (AES).

The book [The Design of Rijndael](http://www.amazon.com/The-Design-RijndaeL-Information-Cryptography/dp/3540425802) has a very fascinating first chapter where the authors describe the selection
process proposed by the NIST to chose the new AES, from which I would like to share here some facts that are quite interesting. 
They prove, that [you don't roll your own crypto](http://security.stackexchange.com/a/18198).

Note that I don't claim to know the stuff I'm presenting here, or be an expert in cryptography, I'm just learning about this topic and I thought it would be interesting to share this story. I've also
added a list of books at the bottom, that are the ones I've been using to learn about it.

## The selection process ##

The selection process for AES started in 1997 and it was open, anyone could submit and entry as long as the entry met the requirements:

- Entries should be for symmetric block ciphers, for block lengths of 128 bits, and key lengths of 128, 192 and 256 bits.
- Entries should be available in a worldwide royalty-free basis.

The designers should provide:

- A complete written specification as an algorithm
- A reference implementation in ANSI C, and mathematically optimized versions in ANSI C and Java.
- Implementation of [known-answer and Monte Carlo tests](http://csrc.nist.gov/groups/STM/cavp/) for the algorithms, and the expected outputs for a correct implementation of their block cipher.
- Statements about the estimated computational requirements both for hardware and software.
- Statements about the expected strength against cryptanalytic attacks
- Statements about the advantages and limitations of the cipher in various applications.

The security and evaluation of the submissions was not going to be made by NIST, but by the cryptology community. Anyone could have commented on the entries and send their papers back to 
the NIST.

As you can see from the requirements, this wasn't a contest for hobbyists, it required serious effort and knowledge. This meant that many proposal got filtered out simply by these requirements.

From the start something quite cool happened, a team called Cryptix decided to provide Java implementations for all ciphers and the KAT and MCT tests. Here we can see the community working together
to achieve a common goal.

## Round One ##

Another interesting fact from the selection process was that it happened in the open, together with conferences about security that gathered most of the researchers interested in the topic.

The cryptology community mounted different kinds of attacks and tried to analyze the different candidates. Then people will send submissions to be presented at the conference. The main topics of
analysis were:

### Security ###

This was the most important category, no news about it. Some candidates already showed some theoretical design flaws at this stage. Later the book develops the math behind AES and one can see that
one doesn't design an encryption algorithm over some beers. This might seem obvious, but still people keep designing their own encryption.

### Costs ###

Here the evaluation was two fold. First, algorithms should be free of royalties as mentioned above. Also contestants were not allowed to exercise patents over other people's ideas. The second part
was the analysis of computational costs, program size, memory usage, and so on.

### Algorithm Difficulty ###

Here the algorithms were analyzed on how easy was to implement them for different platforms. From 8-bit micro-controllers to dedicated hardware, like encryption/decryption at one gigabit-per-second rates.

They were also interested in _key-agility_, that is, how easy it is to setup new keys for the algorithm.

Finally, simplicity played an important role: how easy it is to implement the algorithm and make sure that the implementation is correct.

## Selecting the Five Finalists ##

Fast forward to 1999, where the second AES conference was held in Rome. Here papers presented crypto-attacks, cipher cross-analysis and _algorithm observations_. Were you ever afraid of code reviews? Well,
imagine the whole cryptology community reviewing your code. If your code survives the process, then there's must be something good in it. At this point it was shown that Magenta, the entry by Deutsche Telekom
didn't satisfy the security requirements imposed by NIST. Another algorithm called DEAL was know to not satisfy the security requirements, and another paper demonstrated that an algorithm called HPC had weaknesses.

An example that shows how important peer review is in this kind of situations was a [paper](http://csrc.nist.gov/archive/aes/round1/conf2/papers/gladman.pdf) presented by a researcher that wasn't member of any 
of the contestant teams. This person analyzed the performance of the algorithms on Pentium Processors, showing that Rijndael was among the five fastest algorithms.

Another person presented a [paper](http://csrc.nist.gov/archive/aes/round1/conf2/papers/biham2.pdf) comparing the security strength of the presented algorithms, showing that there was a big margin between them,
prompting for this detail to be taken into account when making a choosing and algorithm. There was an algorithm called SERPENT that was slow, but it had a high margin of security.

Other papers focused on how the algorithm performed in 8-bit and 32-bit processors. Some algorithms didn't even fit into the smaller architectures. Again, Rijndael was one of the best algorithms in this category.

At the end of the conference there was a workshop where the five finalists were announced:

- MARS, by IBM
- RC6, by RSA
- Rijndael, by Daemen and Rijmen, researchers
- Serpent, by Anderson, Bihman, Knudsen, researchers
- Twofish, by Counterpane, Bruce Schneier's team

## Round Two ##

At this stage NIST made another call for papers discussing the finalist algorithms. In this case even the NSA took part, sending several performance simulations that were done for the finalists. On the area
of cryptographic attacks there were no breakthroughs, since none of the finalist showed any weaknesses that would disqualify them from the competition. On the area of hardware implementation, Rijndael performed
well again.

The aforementioned results were presented at a conference in New York City, in April 2000, ending with a questionnaire to the attendants to vote for their favorite algorithm. 
Rijndael was voted the public's favorite.

## The Selection ##

On October of the same year, the NIST announced that Rijndael would become the new AES without any modifications. The NIST published a [report](http://csrc.nist.gov/archive/aes/round2/r2report.pdf) were it made
the announcement, saying about Rijndael:

>Rijndael appears to be consistently a very good performer in both hardware and software across a wide range of computing environments regardless of its use in feedback or non- feedback modes. 
Its key setup time is excellent, and its key agility is good. Rijndael’s very low memory requirements make it very well suited for restricted-space environments, in which it also demonstrates excellent performance. 
Rijndael’s operations are among the easiest to defend against power and timing attacks. Additionally, it appears that some defense can be provided against such attacks without significantly impacting Rijndael’s 
performance. Rijndael is designed with some flexibility in terms of block and key sizes, and the algorithm can accommodate alterations in the number of rounds, although these features would require further study and are not being considered at this time.
>
>Finally, Rijndael’s internal round structure appears to have good potential to benefit from instruction-level parallelism.

## Conclusion ##

I hope you found this story as interesting as I found it when I read it for the first time. For me the take away from it is that while it might be useful to create our own cipher algorithm for education purposes, 
we should never attempt to create one to be used in production. Also, please don't publish them. Somebody will use them. I've seen how people have tried to use in production complete jokes such as 
[gifsockets](http://stackoverflow.com/questions/13593420/countdown-timer-image-gif-in-email). We could see that teams like the people from Deutsche Telekom had created algorithms that weren't' 
secure enough according to the selection criteria. Also, the eyes and scrutiny of world's cryptology experts are a better safety net than what we might think is _safe_. 
As they say on TV: don't try this at home, kids.

As I said before, this is based on Chapter 1 from the book [The Design of Rijndael](http://www.amazon.com/The-Design-RijndaeL-Information-Cryptography/dp/3540425802). It's a quite small book that describes
the mathematical background behind AES, it's design and implementation.

## Books ##

In case you want to learn more about the subject, here are some books I've been studying:

- [The Design of Rijndael](http://www.amazon.com/The-Design-RijndaeL-Information-Cryptography/dp/3540425802)
- [A Course in Number Theory and Cryptography](http://www.amazon.com/Course-Number-Cryptography-Graduate-Mathematics/dp/0387942939/)
- [Primes and Programming](http://www.amazon.com/Primes-Programming-Peter-J-Giblin/dp/0521409888/). Examples for this book are in Pascal
- [A Computational Introduction to Number Theory and Algebra](http://www.amazon.com/Computational-Introduction-Number-Theory-Algebra/dp/0521516447/). This book has a very clear introduction to the mathematical concepts
- [Prime Numbers: A Computational Perspective](http://www.amazon.com/Prime-Numbers-Computational-Richard-Crandall/dp/0387252827/). Apart from the great content, this book is written by Richard Crandall, who was Apple's Chief Cryptographer. The other author is Carl Pomerance, an authority in Number Theory