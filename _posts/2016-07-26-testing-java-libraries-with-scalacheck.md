---
layout: post
title: "Testing Java Libraries from ScalaCheck"
---

# {{page.title}} #

In this article I would like to show you how to integrate ScalaCheck
into a Maven project in order to test your Java classes. I will use as
an example the PhoneNumber class as seen on Item 9 on the book
Effective Java. The idea will be to test that the `equals` method
implementation on that class conforms to the _equals contract_
according to the Java Specification (more on that later). Also we will
be testing a couple of Netty handlers that could be used to
Encode/Decode a `PhoneBook` object in order to send it on the network.

The finished project could be found on this Github repo:
[https://github.com/videlalvaro/phone-guide](https://github.com/videlalvaro/phone-guide)

## The PhoneNumber Class ##

Here's the `PhoneNumber` class based on Item 9 from the book Effective
Java. This class is special because it overrides the `equals` method,
so we want to use ScalaCheck to verify that our `equals`
implementation follows the contract specified in the Java
Specification.

Here's the full sourcecode for this class:

{% highlight java %}
package org.videlalvaro.phoneguide;

import org.apache.commons.lang.builder.HashCodeBuilder;

/**
 * As seen in Effective Java Item 9
 */
public final class PhoneNumber {
    private final short areaCode;
    private final short prefix;
    private final short lineNumber;

    public PhoneNumber(int areaCode, int prefix, int lineNumber) {
        rangeCheck(areaCode,    999, "area code");
        rangeCheck(prefix,      999, "prefix");
        rangeCheck(lineNumber, 9999, "line number");

        this.areaCode = (short) areaCode;
        this.prefix = (short) prefix;
        this.lineNumber = (short) lineNumber;
    }

    public static PhoneNumber fromPhoneNumber(PhoneNumber phoneNumber) {
        return new PhoneNumber(phoneNumber.getAreaCode(), phoneNumber.getPrefix(), phoneNumber.getLineNumber());
    }

    public short getAreaCode() {
        return areaCode;
    }

    public short getPrefix() {
        return prefix;
    }

    public short getLineNumber() {
        return lineNumber;
    }

    private static void rangeCheck(int arg, int max, String name) {
        if (arg < 0 || arg > max)
            throw new IllegalArgumentException(name + ":" + arg);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if(!(o instanceof PhoneNumber))
            return false;
        PhoneNumber pn = (PhoneNumber) o;
        return pn.lineNumber == lineNumber
                && pn.prefix == prefix
                && pn.areaCode == areaCode;
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 31)
                .append(areaCode)
                .append(prefix)
                .append(lineNumber)
                .toHashCode();
    }
}
{% endhighlight %}

This class goes into the
`src/main/java/org/videlalvaro/phoneguide/PhoneNumber.java ` file.

As you can see in the code we also override `hashCode` since whenever
we override `equals` we should override `hashCode` as well. Here I
took the liberty of using the `HashCodeBuilder` class from
`apache-commons`, since it provides helper methods that let you build
a correct implementation of `hashCode`.

Now that we have the class we want to test, let's see how to setup the
build environment.

## Maven Setup ##

In this project I've decided to use Maven, since it's one of the most
popular tools for building Java projects. In order to use ScalaCheck
we need to add a couple of libraries as dependencies. Here's an
excerpt from the `pom.xml` file

{% highlight xml %}
	<dependencies>
		<dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-all</artifactId>
            <version>4.0.36.Final</version>
            <scope>compile</scope>
        </dependency>
        <dependency>
            <groupId>commons-lang</groupId>
            <artifactId>commons-lang</artifactId>
            <version>2.6</version>
        </dependency>
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>${scala.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.scalatest</groupId>
            <artifactId>scalatest_2.10</artifactId>
            <version>2.2.5</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.scalatest</groupId>
            <artifactId>scalatest-maven-plugin</artifactId>
            <version>1.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.scalacheck</groupId>
            <artifactId>scalacheck_2.10</artifactId>
            <version>1.12.5</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
{% endhighlight %}

There we specify the dependencies on Scala the language, ScalaTest
which we will use for writing our test suites and running the tests,
and finally there's the ScalaCheck dependency which we will use to
write our property based tests. We also added the dependencies for
Netty, which we will use later in the project, and `commons-lang`
which gives use the `HashCodeBuilder` class.

Then we need to configure the `scala-maven-plugin` and the
`scalatest-maven-plugin` which we will use to compile and run our
tests. Here's what we need to add to our `pom.xml` file:

{% highlight xml %}
    <build>
        <plugins>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <recompileMode>incremental</recompileMode>
                    <useZincServer>true</useZincServer>
                </configuration>
                <executions>
                    <execution>
                        <id>compile</id>
                        <goals>
                            <goal>compile</goal>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>doc</goal>
                            <goal>doc-jar</goal>
                        </goals>
                    </execution>
                    <execution>
                        <goals>
                            <goal>doc</goal>
                        </goals>
                        <phase>site</phase>
                    </execution>
                </executions>
            </plugin>
            <!-- disable surefire -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.7</version>
                <configuration>
                    <skipTests>true</skipTests>
                </configuration>
            </plugin>
            <!--enable scalatest-->
            <plugin>
                <groupId>org.scalatest</groupId>
                <artifactId>scalatest-maven-plugin</artifactId>
                <version>1.0</version>
                <configuration>
                    <reportsDirectory>${project.build.directory}/surefire-reports</reportsDirectory>
                    <junitxml>.</junitxml>
                    <filereports>WDF TestSuite.txt</filereports>
                </configuration>
                <executions>
                    <execution>
                        <id>test</id>
                        <goals>
                            <goal>test</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
{% endhighlight %}

As you can see we are telling maven how to build our Scala test
sources and then how to execute them. For that we first disable
maven's Surefire to enable the test runner provided by ScalaTest.

If at this point we run `mvn compile` it should build our project. Now
let's add some tests.

## Testing our equals implementation ##

According to Effective Java, a conforming implementation of `equals`
should have the following properties:

- Reflexive: For any non-null reference value `x`, `x.equals(x)` must return `true`.
- Symmetric: For any non-null reference values `x` and `y`, `x.equals(y)` must return true if and only if `y.equals(x)` returns `true`.
- Transitive: For any non-null reference values `x`, `y`, `z`, if `x.equals(y)` returns `true` and `y.equals(z)` returns `true` then `x.equals(z)` returns `true`.
- Consistent: For any non-null reference values `x` and `y`, multiple invocations of `x.equals(y)` consistently return `true` or consistently return `false`, provided no information used in `equals` comparisons on the objects is modified.
- For any non-null reference value `x`, `x.equals(null)` must return `false`.

Let's try to use ScalaCheck to test these properties. If you want to
learn more about ScalaCheck, take a look at their [user
guide](https://github.com/rickynils/scalacheck/blob/master/doc/UserGuide.md)

In order to test our `PhoneBook` class first we need to tell
ScalaCheck how to generate arbitrary instances of our class. Let's add
the following code inside the file
`src/test/scala/org/videlalvaro/phoneguide/generators/Generators.scala`

{% highlight scala %}
package org.videlalvaro.phoneguide.generators

import org.scalacheck.{Arbitrary, Gen}
import org.videlalvaro.phoneguide.PhoneNumber

object Generators {

  implicit val arbPhoneNumber: Arbitrary[PhoneNumber] = Arbitrary(genPhoneNumber)

  def genPhoneNumber = for {
    areaCode <- Gen.choose(1, 999)
    prefix <- Gen.choose(1, 999)
    lineNumber <- Gen.choose(1, 9999)
  } yield new PhoneNumber(areaCode, prefix, lineNumber)

}
{% endhighlight %}

There we have a function `genPhoneNumber` which lets ScalaCheck
generate random values for the `areaCode`, `prefix` and `lineNumber`
fields, and based on those we _yield_ new instances of the
`PhoneNumber` class.

Then for ScalaCheck to be able to use our generator we need to provide
an implicit conversion from our generator into ScalaCheck's
`Arbitrary` class, which is what the `implicit val arbPhoneNumber:
Arbitrary[PhoneNumber] = Arbitrary(genPhoneNumber)` line is doing.

With that code in place then we can write code like:

{% highlight scala %}
	forAll { (phoneNumber: PhoneNumber) =>
      phoneNumber.equals(phoneNumber) should be (true)
    }
{% endhighlight %}

Provided that the generator and the arbitrary definitions are in
scope.

Now let's see how the test code looks like:

{% highlight scala %}
package org.videlalvaro.phoneguide

import org.scalatest.{Matchers, FunSuite}
import org.scalatest.prop.{GeneratorDrivenPropertyChecks, Checkers}

import org.videlalvaro.phoneguide.generators.Generators._

class PhoneNumberTest extends FunSuite with GeneratorDrivenPropertyChecks with Matchers {

  test("equals should be reflexive") {
    forAll { (phoneNumber: PhoneNumber) =>
      phoneNumber.equals(phoneNumber) should be (true)
    }
  }

  test("equals should be symmetric") {
    forAll { (phoneNumber: PhoneNumber) =>
      val phoneNumber2 = PhoneNumber.fromPhoneNumber(phoneNumber)
      phoneNumber.equals(phoneNumber2) should be (true)
      phoneNumber2.equals(phoneNumber) should be (true)
    }
  }

  test("equals should be transitive") {
    forAll { (phoneNumber: PhoneNumber) =>
      val phoneNumber2 = PhoneNumber.fromPhoneNumber(phoneNumber)
      val phoneNumber3 = PhoneNumber.fromPhoneNumber(phoneNumber2)
      phoneNumber.equals(phoneNumber2) should be (true)
      phoneNumber.equals(phoneNumber3) should be (true)
      phoneNumber2.equals(phoneNumber) should be (true)
      phoneNumber2.equals(phoneNumber3) should be (true)
      phoneNumber3.equals(phoneNumber) should be (true)
      phoneNumber3.equals(phoneNumber2) should be (true)
    }
  }

  test("equals should be consistent") {
    forAll { (phoneNumber: PhoneNumber) =>
      val phoneNumber2 = PhoneNumber.fromPhoneNumber(phoneNumber)
      phoneNumber.equals(phoneNumber2) should be (true)
      phoneNumber.equals(phoneNumber2) should be (true)
      phoneNumber2.equals(phoneNumber) should be (true)
      phoneNumber2.equals(phoneNumber) should be (true)
    }
  }

  test("equals should respect non-nullity") {
    forAll { (phoneNumber: PhoneNumber) =>
      phoneNumber.equals(null) should be (false)
    }
  }
}
{% endhighlight %}

In our `PhoneNumberTest` class we extend the [FunSuite](http://www.scalatest.org/getting_started_with_fun_suite) class provided by ScalaCheck that will allow us to write descriptive test functions like the ones in our example: `test("equals should be consistent") {...}`. We also mixed in the [GeneratorDrivenPropertyChecks](http://www.scalatest.org/user_guide/generator_driven_property_checks) trait which gives us the `forAll` method required to write our properties. Finally, and as a matter of taste, we mixed the [Matchers](http://www.scalatest.org/user_guide/using_matchers) trait that let us write assertions using `should` and similar _matchers_: `phoneNumber.equals(phoneNumber2) should be (true)`.

In our tests we are saying that for all PhoneNumber instances: `forAll { (phoneNumber: PhoneNumber) =>` what follows in the method body should be true, like in our first test, where and object should be equal to itself: `phoneNumber.equals(phoneNumber) should be (true)`. In a similar way we test the other properties of a correct `equals` implementation.

Let's execute the tests by running `mvn test`. If all went well you
should see output like this:

{% highlight bash %}
Discovery starting.
Discovery completed in 178 milliseconds.
Run starting. Expected test count is: 5
PhoneNumberTest:
- equals should be reflexive
- equals should be symmetric
- equals should be transitive
- equals should be consistent
- equals should respect non-nullity
Run completed in 516 milliseconds.
Total number of tests run: 5
Suites: completed 2, aborted 0
Tests: succeeded 5, failed 0, canceled 0, ignored 0, pending 0
All tests passed.
{% endhighlight %}

To finish the article, let's add a couple of Netty encoders and
decoders and see how to test them using ScalaCheck.

## Testing Netty Handlers Using ScalaCheck ##

Let's say that our little phone-guide got distributed and now we need
to send our `PhoneNumber` objects over the network. In Java there's a
pretty cool library to implement network servers called
[Netty](http://netty.io/). In order to write our `PhoneNumber` objects
to the network we need to write an encoder class, and to be able to
read them back from the network we have to write a decoder class. Then
we provide those classes to Netty and it will know how to call them in
order to send and receive `PhoneNumber` objects.

Here's the `MessageEncoder` implementation that you should store in
the
`src/main/java/org/videlalvaro/phoneguide/netty/MessageEncoder.java `
file:

{% highlight java %}
{% endhighlight %}

And here is the `MessageDecoder` class that should go in the
`src/main/java/org/videlalvaro/phoneguide/netty/MessageDecoder.java`
file:

{% highlight java %}
{% endhighlight %}

The implementation of these encoder/decoder classes is quite
simple. We just tell netty how to write each class field to the
network and how to read it back. For more details check the Netty
[documentation](http://netty.io/wiki/index.html).

In an usual Netty application we would create a channel that will
write or read data from the network, but for a test we don't want to
setup a whole network stack. Luckily Netty provides an
`EmbeddedChannel` class that let use simulate writing and reading from
a channel without having to create network connections. Let's create
the test for our encoder/decoder classes.

{% highlight scala %}
package org.videlalvaro.phoneguide.netty

import io.netty.channel.embedded.EmbeddedChannel
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatest.{FunSuite, Matchers}
import org.videlalvaro.phoneguide.PhoneNumber
import org.videlalvaro.phoneguide.generators.Generators._

class EncoderDecoderTest extends FunSuite with GeneratorDrivenPropertyChecks with Matchers {
  test("netty encode/decode message") {
    forAll { (phoneNumber: PhoneNumber) =>
      val channel = new EmbeddedChannel(new MessageEncoder(), new MessageDecoder())

      channel.writeOutbound(phoneNumber)
      channel.writeInbound(channel.readOutbound())

      val readPhoneNumber = channel.readInbound();
      readPhoneNumber should not be (null)
      readPhoneNumber.equals(phoneNumber) should be (true)
      phoneNumber.equals(readPhoneNumber) should be (true)
    }
  }
}
{% endhighlight %}

There we want to test that for all instances of our `PhoneNumber`
class, if we encode it using Netty, we write it to the channel, and
then we read it back and decode it, we get the right `PhoneNumber`
instance, that is, it should be `equal` to the one we started from.

If we now run `mvn test` we should see something like this:

{% highlight bash %}
Discovery starting.
Discovery completed in 170 milliseconds.
Run starting. Expected test count is: 6
EncoderDecoderTest:
- netty encode/decode message
PhoneNumberTest:
- equals should be reflexive
- equals should be symmetric
- equals should be transitive
- equals should be consistent
- equals should respect non-nullity
Run completed in 564 milliseconds.
Total number of tests run: 6
Suites: completed 3, aborted 0
Tests: succeeded 6, failed 0, canceled 0, ignored 0, pending 0
All tests passed.
{% endhighlight %}

As you can see instead of us providing very specific sample instances
of our `PhoneNumber` class to unit tests, we are letting ScalaCheck
generate them so we can verify properties on them. I think this is
quite powerful.

## Wrapping Up ##

In this article we learned how to setup a Java project that will be
tested from ScalaTest using ScalaCheck. Once we had the build system
set up, we implemented our Java class and then went straight to
writing tests for it, seeing how to extend ScalaTest `FunSuite` so we
could write `ScalaCheck` style properties in our tests. I hope the
article would be useful for you and let's you get started with
ScalaCheck even if you are implementing a Java project.