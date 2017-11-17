/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { take as take$ } from 'rxjs/operators/take';
import { last as last$ } from 'rxjs/operators/last';

import Types from './Types';
import createModel from './createModel';
import createCollection from './createCollection';
import isModel from './isModel';
import isCollection from './isCollection';

describe('frint-data › createCollection', function () {
  it('creates Collection class', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
    });

    const people = new People();
    expect(people).to.be.instanceof(People);
  });

  it('creates Collection with Model', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
    });

    const people = new People([
      { name: 'Harry' },
      new Person({ name: 'Hermione' }),
      // { name: 'Hermione' },
      { name: 'Ron' }
    ]);

    expect(people).to.be.instanceof(People);
    expect(isCollection(people)).to.equal(true);

    // first
    expect(isModel(people.at(0))).to.equal(true);
    expect(people.at(0).name).to.equal('Harry');

    // second
    expect(isModel(people.at(1))).to.equal(true);
    expect(people.at(1).name).to.equal('Hermione');

    // third
    expect(isModel(people.at(2))).to.equal(true);
    expect(people.at(2).name).to.equal('Ron');
  });

  it('checks with multiple collection instances', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
    });

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

    expect(people1.at(0).name).to.equal('Harry');
    expect(people1.at(1).name).to.equal('Hermione');
    expect(people1.at(2).name).to.equal('Ron');

    expect(people2.at(0).name).to.equal('A');
    expect(people2.at(1).name).to.equal('B');
    expect(people2.at(2).name).to.equal('C');
  });

  it('creates collection with methods', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
      findAt(n) {
        return this.at(n);
      }
    });

    const people = new People([
      { name: 'Frint' },
      { name: 'Blah' },
      { name: 'Yo' }
    ]);

    expect(people.findAt).to.be.a('function');
    expect(people.findAt(1).name).to.equal('Blah');
  });

  it('throws error on conflicting method', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
      at(n) { /* istanbul ignore next */
        return this.at(n);
      }
    });

    function getPeople() {
      new People([]); // eslint-disable-line
    }

    expect(getPeople).to.throw(/conflicting method name: at/);
  });

  it('listens for self changes', function (done) {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });

    const People = createCollection({
      model: Person,

      customPush(m) {
        return this.push(m);
      },
    });

    const people = new People([
      { name: 'Harry' }
    ]);

    people.get$()
      .pipe(
        take$(3),
        last$()
      )
      .subscribe(function (collection) {
        expect(collection.length).to.equal(3);

        expect(collection.at(0).name).to.equal('Harry');
        expect(collection.at(1).name).to.equal('Ron');
        expect(collection.at(2).name).to.equal('Hermione');

        done();
      });

    people.customPush(new Person({ name: 'Ron' }));
    people.customPush(new Person({ name: 'Hermione' }));
  });

  it('listens for child-model changes', function (done) {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
      setName(name) {
        this.name = name;
      },
    });

    const People = createCollection({
      model: Person,
    });

    const people = new People([
      { name: 'Harry' },
      { name: 'Ron' },
      { name: 'Hermione' }
    ]);

    people.listen$('change')
      .pipe(
        take$(2),
        last$()
      )
      .subscribe(function ({ collection }) {
        expect(collection.at(2).name).to.equal('Hermione Granger-Weasley');

        done();
      });

    const hermione = people.at(2);
    hermione.setName('Hermione Granger');
    hermione.setName('Hermione Granger-Weasley');
  });

  it('listens for child-model destroys', function (done) {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });

    const People = createCollection({
      model: Person,
    });

    const people = new People([
      { name: 'Harry' },
      { name: 'Ron' },
      { name: 'Hermione' }
    ]);

    people.listen$('change')
      .pipe(
        take$(1),
        last$()
      )
      .subscribe(function ({ collection }) {
        expect(collection.length).to.equal(2);
        expect(collection.at(0).name).to.equal('Harry');
        expect(collection.at(1).name).to.equal('Ron');

        done();
      });

    const hermione = people.at(2);
    hermione.destroy();
  });

  it('applies initialize', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });

    const People = createCollection({
      model: Person,
      initialize() {
        this.push(new Person({
          name: 'Initialize'
        }));
      },
    });

    const people = new People();

    expect(people.at(0).name).to.equal('Initialize');
  });

  it('does not allow mutation by default', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });

    const People = createCollection({
      model: Person,

      customPush(m) {
        return this.push(m);
      },
    });

    const people = new People([
      { name: 'Foo' }
    ]);

    expect(people.length).to.equal(1);
    expect(people.at(0).name).to.equal('Foo');
    expect(people.push).to.equal(undefined);

    people.customPush(new Person({ name: 'Bar' }));
    expect(people.length).to.equal(2);
    expect(people.at(1).name).to.equal('Bar');
  });

  describe('Collection :: at()', function () {
    it('finds model by index', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.at(0).name).to.equal('Harry');
      expect(people.at(1).name).to.equal('Hermione');
      expect(people.at(2).name).to.equal('Ron');

      people.at$(1)
        .subscribe(function (model) {
          expect(model.name).to.equal('Hermione');

          done();
        });
    });
  });

  describe('Collection :: filter()', function () {
    it('filters the collection', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPush(m) {
          return this.push(m);
        },
      });

      const people = new People();

      people.customPush(new Person({ name: 'Harry' }));
      people.customPush(new Person({ name: 'Hermione' }));
      people.customPush(new Person({ name: 'Ron' }));

      const modelsWithH = people.filter((person) => {
        return person.name.startsWith('H');
      });

      expect(modelsWithH.length).to.equal(2);
      expect(modelsWithH[0].name).to.equal('Harry');
      expect(modelsWithH[1].name).to.equal('Hermione');

      people
        .filter$(p => p.name.startsWith('H'))
        .subscribe(function (models) {
          expect(models.length).to.equal(2);
          expect(models[0].name).to.equal('Harry');
          expect(models[1].name).to.equal('Hermione');

          done();
        });
    });
  });

  describe('Collection :: find()', function () {
    it('finds single model from collection', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.equal(3);

      const hermione = people.find(function (person) {
        return person.name === 'Hermione';
      });

      expect(hermione.name).to.equal('Hermione');

      people
        .find$(p => p.name === 'Hermione')
        .subscribe(function (model) {
          expect(model.name).to.equal('Hermione');

          done();
        });
    });
  });

  describe('Collection :: findIndex()', function () {
    it('finds index of the model in collection', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.equal(3);

      const hermione = people.at(1);
      const index = people.findIndex(hermione);

      expect(index).to.equal(1);

      people
        .findIndex$(hermione)
        .subscribe(function (i) {
          expect(i).to.equal(1);

          done();
        });
    });
  });

  describe('Collection :: forEach()', function () {
    it('iterates through the collection', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPush(m) {
          return this.push(m);
        },
      });

      const people = new People();

      people.customPush(new Person({ name: 'Harry' }));
      people.customPush(new Person({ name: 'Hermione' }));
      people.customPush(new Person({ name: 'Ron' }));

      const names = [];
      people.forEach((person) => {
        names.push(person.name);
      });

      expect(names).to.deep.equal([
        'Harry',
        'Hermione',
        'Ron'
      ]);
    });
  });

  describe('Collection :: map()', function () {
    it('iterates and maps the collection', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPush(m) {
          return this.push(m);
        },
      });

      const people = new People();

      people.customPush(new Person({ name: 'Harry' }));
      people.customPush(new Person({ name: 'Hermione' }));
      people.customPush(new Person({ name: 'Ron' }));

      const names = people.map((person) => {
        return person.name;
      });

      expect(names).to.deep.equal([
        'Harry',
        'Hermione',
        'Ron'
      ]);
    });
  });

  describe('Collection :: pop()', function () {
    it('removes last model from collection and returns it', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPop() {
          return this.pop();
        }
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.equal(3);

      const lastModel = people.customPop();

      expect(people.length).to.equal(2);

      expect(people.toJS()).to.deep.equal([
        { name: 'Harry' },
        { name: 'Hermione' }
      ]);
      expect(lastModel.name).to.equal('Ron');
    });
  });

  describe('Collection :: push()', function () {
    it('appends model to the end of the collection', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPush(m) {
          return this.push(m);
        },
      });

      const people = new People();

      people.customPush(new Person({ name: 'Harry' }));
      people.customPush(new Person({ name: 'Hermione' }));
      people.customPush(new Person({ name: 'Ron' }));

      expect(people.at(0).name).to.equal('Harry');
      expect(people.at(1).name).to.equal('Hermione');
      expect(people.at(2).name).to.equal('Ron');
    });
  });

  describe('Collection :: reduce()', function () {
    it('iterates and reduces the collection', function () {
      const Person = createModel({
        schema: {
          age: Types.number.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPush(m) {
          return this.push(m);
        },
      });

      const people = new People();

      people.customPush(new Person({ age: 10 }));
      people.customPush(new Person({ age: 20 }));
      people.customPush(new Person({ age: 30 }));

      const totalAge = people.reduce((result, model) => {
        return result + model.age;
      }, 0);

      expect(totalAge).to.equal(10 + 20 + 30);
    });
  });

  describe('Collection :: remove()', function () {
    it('removes specific model from collection', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customRemove(m) {
          return this.remove(m);
        },
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.equal(3);

      const hermione = people.at(1);
      people.customRemove(hermione);

      expect(people.length).to.equal(2);

      expect(people.toJS()).to.deep.equal([
        { name: 'Harry' },
        { name: 'Ron' }
      ]);
    });
  });

  describe('Collection :: removeFrom()', function () {
    it('removes specific model from collection by index', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customRemoveFrom(n) {
          return this.removeFrom(n);
        },
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.equal(3);

      people.customRemoveFrom(0);

      expect(people.length).to.equal(2);

      expect(people.toJS()).to.deep.equal([
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);
    });
  });

  describe('Collection :: shift()', function () {
    it('removes first model from collection and returns it', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customShift() {
          return this.shift();
        },
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.equal(3);

      const firstModel = people.customShift();

      expect(people.length).to.equal(2);

      expect(people.toJS()).to.deep.equal([
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);
      expect(firstModel.name).to.equal('Harry');
    });
  });

  describe('Collection :: toJS()', function () {
    it('converts to plain array of plain objects', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(isModel(people.at(0))).to.equal(true);
      expect(isModel(people.at(1))).to.equal(true);
      expect(isModel(people.at(2))).to.equal(true);

      expect(people.toJS()).to.deep.equal([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);
    });
  });

  describe('Collection :: unshift()', function () {
    it('prepends model at the beginning of the collection', function () {
      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const People = createCollection({
        model: Person,

        customPush(m) {
          return this.push(m);
        },

        customUnshift(m) {
          return this.unshift(m);
        },
      });

      const people = new People();

      people.customPush(new Person({ name: 'Harry' }));
      people.customPush(new Person({ name: 'Hermione' }));

      people.customUnshift(new Person({ name: 'Ron' }));

      expect(people.at(0).name).to.equal('Ron');
      expect(people.at(1).name).to.equal('Harry');
      expect(people.at(2).name).to.equal('Hermione');
    });
  });
});
