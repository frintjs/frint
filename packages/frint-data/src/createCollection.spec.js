/* global describe, it */
import { expect } from 'chai';

import Types from './Types';
import createModel from './createModel';
import createCollection from './createCollection';
import isModel from './isModel';
import isCollection from './isCollection';

describe('createCollection', function () {
  it('creates Collection class', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });
    const People = createCollection(Person);

    const people = new People();
    expect(people).to.be.instanceof(People);
  });

  it('creates Collection with Model', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });
    const People = createCollection(Person);

    const people = new People([
      { name: 'Harry' },
      new Person({ name: 'Hermione' }),
      // { name: 'Hermione' },
      { name: 'Ron' }
    ]);

    expect(people).to.be.instanceof(People);
    expect(isCollection(people)).to.eql(true);

    // first
    expect(isModel(people.at(0))).to.eql(true);
    expect(people.at(0).name).to.eql('Harry');

    // second
    expect(isModel(people.at(1))).to.eql(true);
    expect(people.at(1).name).to.eql('Hermione');

    // third
    expect(isModel(people.at(2))).to.eql(true);
    expect(people.at(2).name).to.eql('Ron');
  });

  it('checks with multiple collection instances', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });
    const People = createCollection(Person);

    const people1 = new People([
      { name: 'Harry' },
      { name: 'Hermione' },
      { name: 'Ron' }
    ]);

    const people2 = new People([
      { name: 'A' },
      { name: 'B' },
      { name: 'C' }
    ]);

    expect(people1.at(0).name).to.eql('Harry');
    expect(people1.at(1).name).to.eql('Hermione');
    expect(people1.at(2).name).to.eql('Ron');

    expect(people2.at(0).name).to.eql('A');
    expect(people2.at(1).name).to.eql('B');
    expect(people2.at(2).name).to.eql('C');
  });

  it('creates collection with methods', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });
    const People = createCollection(Person, {
      findAt(n) {
        return this.at(n);
      }
    });

    const people = new People([
      { name: 'Fahad' },
      { name: 'Blah' },
      { name: 'Yo' }
    ]);

    expect(people.findAt).to.be.a('function');
    expect(people.findAt(1).name).to.eql('Blah');
  });

  it('throws error on conflicting method', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });
    const People = createCollection(Person, {
      at(n) {
        return this.at(n);
      }
    });

    function getPeople() {
      new People([]); // eslint-disable-line
    }

    expect(getPeople).to.throw(/conflicting method name: at/);
  });

  it('listens for self changes', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });

    const People = createCollection(Person);

    const people = new People([
      { name: 'Harry' }
    ]);

    let changeCounter = 0;

    const cancelListener = people.on('change', function () {
      changeCounter++;
    });

    people.push(new Person({ name: 'Ron' }));
    people.push(new Person({ name: 'Hermione' }));

    expect(changeCounter).to.eql(2);

    cancelListener();

    people.push(new Person({ name: 'Luna' }));
    expect(changeCounter).to.eql(2);
  });

  it('listens for child-model changes', function () {
    const Person = createModel({
      name: Types.string.isRequired
    }, {
      setName(name) {
        this.name = name;
      }
    });

    const People = createCollection(Person);

    const people = new People([
      { name: 'Harry' },
      { name: 'Ron' },
      { name: 'Hermione' }
    ]);

    let changeCounter = 0;

    const cancelListener = people.on('change', function () {
      changeCounter++;
    });

    const hermione = people.at(2);
    hermione.setName('Hermione Granger');
    hermione.setName('Hermione Granger-Weasley');

    expect(changeCounter).to.eql(2);

    cancelListener();

    people.push(new Person({ name: 'Luna' }));
    expect(changeCounter).to.eql(2);
  });

  it('listens for child-model destroys', function () {
    const Person = createModel({
      name: Types.string.isRequired
    }, {
      setName(name) {
        this.name = name;
      }
    });

    const People = createCollection(Person);

    const people = new People([
      { name: 'Harry' },
      { name: 'Ron' },
      { name: 'Hermione' }
    ]);

    let changeCounter = 0;

    const cancelListener = people.on('change', function () {
      changeCounter++;
    });

    const hermione = people.at(2);
    hermione.destroy();

    expect(changeCounter).to.eql(1);
    expect(people.length).to.eql(2);
    expect(people.at(0).name).to.eql('Harry');
    expect(people.at(1).name).to.eql('Ron');

    cancelListener();
  });

  it('applies initializers', function () {
    const Person = createModel({
      name: Types.string.isRequired
    });

    function initializer(collection) {
      collection.push(new Person({
        name: 'Initializer'
      }));
    }

    const People = createCollection(Person, {}, [
      initializer
    ]);

    const people = new People();

    expect(people.at(0).name).to.eql('Initializer');
  });
});
