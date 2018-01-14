/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import createClass from '../src/createClass';

describe('createClass', function () {
  it('creates class with `initialize` as constructor', function () {
    const MyClass = createClass({
      initialize(greeting) {
        this.greeting = greeting;
      },

      greet(name) {
        return `${this.greeting}, ${name}`;
      }
    });

    const myClass = new MyClass('Hello');
    expect(myClass.greet('Fahad')).to.equal('Hello, Fahad');
  });
});
