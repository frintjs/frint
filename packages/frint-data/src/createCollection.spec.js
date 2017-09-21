/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

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

    expect(people1.at(0).name).to.eql('Harry');
    expect(people1.at(1).name).to.eql('Hermione');
    expect(people1.at(2).name).to.eql('Ron');

    expect(people2.at(0).name).to.eql('A');
    expect(people2.at(1).name).to.eql('B');
    expect(people2.at(2).name).to.eql('C');
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
      { name: 'Fahad' },
      { name: 'Blah' },
      { name: 'Yo' }
    ]);

    expect(people.findAt).to.be.a('function');
    expect(people.findAt(1).name).to.eql('Blah');
  });

  it('throws error on conflicting method', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });
    const People = createCollection({
      model: Person,
      at(n) {
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
    });

    const people = new People([
      { name: 'Harry' }
    ]);

    people.get$()
      .take(3)
      .last()
      .subscribe(function (collection) {
        expect(collection.length).to.equal(3);

        expect(collection.at(0).name).to.equal('Harry');
        expect(collection.at(1).name).to.equal('Ron');
        expect(collection.at(2).name).to.equal('Hermione');

        done();
      });

    people.push(new Person({ name: 'Ron' }));
    people.push(new Person({ name: 'Hermione' }));
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
      .take(2)
      .last()
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
      .take(1)
      .last()
      .subscribe(function ({ collection }) {
        expect(collection.length).to.eql(2);
        expect(collection.at(0).name).to.eql('Harry');
        expect(collection.at(1).name).to.eql('Ron');

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

    expect(people.at(0).name).to.eql('Initialize');
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

      expect(people.at(0).name).to.eql('Harry');
      expect(people.at(1).name).to.eql('Hermione');
      expect(people.at(2).name).to.eql('Ron');

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
      });

      const people = new People();

      people.push(new Person({ name: 'Harry' }));
      people.push(new Person({ name: 'Hermione' }));
      people.push(new Person({ name: 'Ron' }));

      const modelsWithH = people.filter((person) => {
        return person.name.startsWith('H');
      });

      expect(modelsWithH.length).to.eql(2);
      expect(modelsWithH[0].name).to.eql('Harry');
      expect(modelsWithH[1].name).to.eql('Hermione');

      people
        .filter$(p => p.name.startsWith('H'))
        .subscribe(function (models) {
          expect(models.length).to.equal(2);
          expect(models[0].name).to.eql('Harry');
          expect(models[1].name).to.eql('Hermione');

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

      expect(people.length).to.eql(3);

      const hermione = people.find(function (person) {
        return person.name === 'Hermione';
      });

      expect(hermione.name).to.eql('Hermione');

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

      expect(people.length).to.eql(3);

      const hermione = people.at(1);
      const index = people.findIndex(hermione);

      expect(index).to.eql(1);

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
      });

      const people = new People();

      people.push(new Person({ name: 'Harry' }));
      people.push(new Person({ name: 'Hermione' }));
      people.push(new Person({ name: 'Ron' }));

      const names = [];
      people.forEach((person) => {
        names.push(person.name);
      });

      expect(names).to.eql([
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
      });

      const people = new People();

      people.push(new Person({ name: 'Harry' }));
      people.push(new Person({ name: 'Hermione' }));
      people.push(new Person({ name: 'Ron' }));

      const names = people.map((person) => {
        return person.name;
      });

      expect(names).to.eql([
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
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.eql(3);

      const lastModel = people.pop();

      expect(people.length).to.eql(2);

      expect(people.toJS()).to.eql([
        { name: 'Harry' },
        { name: 'Hermione' }
      ]);
      expect(lastModel.name).to.eql('Ron');
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
      });

      const people = new People();

      people.push(new Person({ name: 'Harry' }));
      people.push(new Person({ name: 'Hermione' }));
      people.push(new Person({ name: 'Ron' }));

      expect(people.at(0).name).to.eql('Harry');
      expect(people.at(1).name).to.eql('Hermione');
      expect(people.at(2).name).to.eql('Ron');
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
      });

      const people = new People();

      people.push(new Person({ age: 10 }));
      people.push(new Person({ age: 20 }));
      people.push(new Person({ age: 30 }));

      const totalAge = people.reduce((result, model) => {
        return result + model.age;
      }, 0);

      expect(totalAge).to.eql(10 + 20 + 30);
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
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.eql(3);

      const hermione = people.at(1);
      people.remove(hermione);

      expect(people.length).to.eql(2);

      expect(people.toJS()).to.eql([
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
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.eql(3);

      people.removeFrom(0);

      expect(people.length).to.eql(2);

      expect(people.toJS()).to.eql([
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
      });

      const people = new People([
        { name: 'Harry' },
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);

      expect(people.length).to.eql(3);

      const firstModel = people.shift();

      expect(people.length).to.eql(2);

      expect(people.toJS()).to.eql([
        { name: 'Hermione' },
        { name: 'Ron' }
      ]);
      expect(firstModel.name).to.eql('Harry');
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

      expect(isModel(people.at(0))).to.eql(true);
      expect(isModel(people.at(1))).to.eql(true);
      expect(isModel(people.at(2))).to.eql(true);

      expect(people.toJS()).to.eql([
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
      });

      const people = new People();

      people.push(new Person({ name: 'Harry' }));
      people.push(new Person({ name: 'Hermione' }));

      people.unshift(new Person({ name: 'Ron' }));

      expect(people.at(0).name).to.eql('Ron');
      expect(people.at(1).name).to.eql('Harry');
      expect(people.at(2).name).to.eql('Hermione');
    });
  });
});
