---
title: Observables
sidebarPartial: guidesSidebar
---

# Observables

<!-- MarkdownTOC depth=2 autolink=true bracket=round -->

- [What is an Observable?](#what-is-an-observable)
- [Implementations](#implementations)
- [Conventions](#conventions)
- [Basic usage](#basic-usage)
- [Examples](#examples)
  - [From known values](#from-known-values)
  - [Interval](#interval)
  - [From DOM event](#from-dom-event)
- [Operators](#operators)
  - [Filter](#filter)
  - [Map](#map)
  - [Merge](#merge)
  - [Scan](#scan)
- [Further reading](#further-reading)

<!-- /MarkdownTOC -->

## What is an Observable?

To quote the [spec](https://github.com/tc39/proposal-observable) directly:

> The Observable type can be used to model push-based data sources such as DOM events, timer intervals, and sockets.

They are:

* **Compositional**: Observables can be composed with higher-order combinators.
* **Lazy**: Observables do not start emitting data until an observer has subscribed.

## Implementations

There are various implementations of the Observable spec. Some of them include:

* [RxJS](https://github.com/ReactiveX/RxJS)
* [zen-observable](https://github.com/zenparsing/zen-observable)

Frint uses RxJS, which is widely adopted by the JavaScript community. Our examples would demonstrate this particular library below.

## Conventions

It is common practice to end your variable names with a `$` sign if it represents an Observable.

```js
const name$ = Rx.Observable.of('Frint');
```

## Basic usage

Create an Observable:

```js
const colors$ = Rx.Observable.create(function (observer) {
  observer.next('red');
  observer.next('green');
  observer.next('blue');

  // observer.error('something wrong here...');

  observer.complete();
});
```

Subscribe to it:

```js
const subscription = colors$.subscribe({
  next: function (color) {
    console.log(color); // `red`, `green`, `blue`
  },
  error: function (error) {
    console.log(error); // never fires
  },
  complete: function() {
    console.log('completed'); // once it is completed
  }
});
```

If you only care about the emitted values, then your subscription code can be shortened:

```js
const subscription = colors$.subscribe(function (color) {
  console.log(color);
});
```

To unsubscribe:

```js
subscription.unsubscribe();
```

## Examples

### From known values

```js
const numbers$ = Rx.Observable.of(1, 2, 3);

numbers$.subscribe(function (number) {
  console.log(number);
});

// Prints these numbers sequentially:
//
//   1
//   2
//   3
```

### Interval

```js
const interval$ = Rx.Observable.interval(1000); // every second

interval$.subscribe(function (x) {
  console.log(x); // `x` is the nth time interval$ has triggered
});

// Prints `x` every second
```

### From DOM event

```js
const clicks$ = Rx.Observable.fromEvent(document, 'click');

clicks$.subscribe(function (mouseEvent) {
  console.log('clicked!');
});

// Prints `clicked`, every time the document is clicked
```

## Operators

RxJS also comes with various operators that can help manage your Observables.

### Filter

Let's say you have an Observable that keeps emitting an integer every 100ms, but you only want values which are divisible by 10.

Like: `0`, `10`, `20`, `30`, ...more.

```js
const interval$ = Rx.Observable.interval(100);

interval$
  .filter(x => x % 10 === 0) // we are filtering out unwanted values here
  .subscribe(x => console.log(x));
```

### Map

We can even map emitted values to something else:

```js
const houses$ = Rx.Observable.of('gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff');

houses$
  .map(x => x.toUpperCase()) // uppercasing the house names
  .subscribe(x => console.log(x));
```

### Merge

Merging two Observables:

```js
const numbers$ = Rx.Observable.of(1, 2, 3);
const colors$ = Rx.Observable.of('red', 'green', 'blue');
const houses$ = Rx.Observable.of('gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff');

numbers$
  .merge(colors$)
  .merge(houses$)
  .subscribe(x => console.log(x)); // emits all values from 3 observables, one by one
```

Alternatively, you could merge them all as follows:

```js
const merged$ = Observable.merge(
  numbers$,
  colors$,
  houses$
);
```

### Scan

Let's say we want to merge all the three observables from above example, and generate a final Object which holds the most recent value of each of them:

```js
{
  number: 3,
  color: 'blue',
  house: 'hufflepuff'
}
```

We can use the `scan` operator to achieve that. The operator `scan` is for Observables, what `reduce` is to arrays in JavaScript.

```js
const merged$ = Rx.Observable.merge(
  numbers$.map(x => ({ number: x })), // map `1` to `{number: 1}`
  colors$.map(x => ({ color: x })), // map `red` to `{color: "red"}`
  houses$.map(x => ({ house: x })) // map `gryffindor` to `{house: "gryffindor"}`
);

merged$
  // we keep merging the previous object with new emitted object
  .scan((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  }, {
    number: 'n/a',
    color: 'n/a',
    house: 'n/a'
  });
```

## Further reading

* [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)
* [Observer](http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html)
* [Subscriber](http://reactivex.io/rxjs/class/es6/Subscriber.js~Subscriber.html)
* [Subscription](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html)
* [Subject](http://reactivex.io/rxjs/class/es6/Subject.js~Subject.html)
