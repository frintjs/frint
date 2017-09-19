/* global describe, it */
import { expect } from 'chai';

import Types from './Types';
import createModel from './createModel';
import createCollection from './createCollection';

describe('frint-data › Types', function () {
  describe('Types :: any', function () {
    it('accepts any values', function () {
      const type = Types.any;

      expect(type(1)).to.eql(1);
      expect(type('hello')).to.eql('hello');
      expect(type([])).to.eql([]);
      expect(type({})).to.eql({});
    });

    it('checks for required values', function () {
      const type = Types.any.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.any.defaults(123);

      expect(type()).to.eql(123);
      expect(type(234)).to.eql(234);
    });
  });

  describe('Types :: array', function () {
    it('accepts undefined unless required', function () {
      const type = Types.array;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts array values', function () {
      const type = Types.array;

      expect(type([])).to.eql([]);
      expect(type([1, 2, 3])).to.eql([1, 2, 3]);
    });

    it('rejects non-array values', function () {
      const type = Types.array;

      expect(() => type(0)).to.throw(/value is not an array/);
      expect(() => type(null)).to.throw(/value is not an array/);
      expect(() => type(true)).to.throw(/value is not an array/);
      expect(() => type({})).to.throw(/value is not an array/);
      expect(() => type(() => {})).to.throw(/value is not an array/);
    });

    it('checks for required values', function () {
      const type = Types.array.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.array.defaults(['hi', 'there']);

      expect(type()).to.eql(['hi', 'there']);
      expect(type([1, 2, 3])).to.eql([1, 2, 3]);
      expect(() => type(123)).to.throw(/value is not an array/);
    });
  });

  describe('Types :: bool', function () {
    it('accepts undefined unless required', function () {
      const type = Types.bool;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts boolean values', function () {
      const type = Types.bool;

      expect(type(true)).to.eql(true);
      expect(type(false)).to.eql(false);
    });

    it('rejects non-boolean values', function () {
      const type = Types.bool;

      expect(() => type(0)).to.throw(/value is not a boolean/);
      expect(() => type(null)).to.throw(/value is not a boolean/);
      expect(() => type('hello world')).to.throw(/value is not a boolean/);
      expect(() => type(() => {})).to.throw(/value is not a boolean/);
    });

    it('checks for required values', function () {
      const type = Types.bool.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.bool.defaults(true);

      expect(type()).to.eql(true);
      expect(() => type(123)).to.throw(/value is not a boolean/);
    });
  });

  describe('Types :: collection', function () {
    it('accepts undefined unless required', function () {
      const type = Types.collection;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts collection instances', function () {
      const type = Types.collection;

      const Person = createModel({
        name: Types.string.isRequired
      });
      const People = createCollection(Person);

      const people = new People([{ name: 'Fahad' }]);

      expect(type(people)).to.eql(people);
    });

    it('rejects non-collection values', function () {
      const type = Types.collection;

      expect(() => type('hello')).to.throw(/value is not a Collection/);
      expect(() => type(null)).to.throw(/value is not a Collection/);
      expect(() => type(true)).to.throw(/value is not a Collection/);
      expect(() => type({})).to.throw(/value is not a Collection/);
      expect(() => type(() => {})).to.throw(/value is not a Collection/);
    });

    it('checks for required values', function () {
      const type = Types.collection.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const Person = createModel({
        name: Types.string.isRequired
      });
      const People = createCollection(Person);

      const people = new People([{ name: 'Fahad' }]);
      const type = Types.collection.defaults(people);

      expect(type()).to.eql(people);

      const otherPeople = new People([{ name: 'Dark Lord' }]);
      expect(type(otherPeople)).to.eql(otherPeople);
      expect(() => type('hello world')).to.throw(/value is not a Collection/);
    });

    it('accepts collection instances of certain Colelction', function () {
      const Person = createModel({
        name: Types.string.isRequired
      });
      const People = createCollection(Person);

      const type = Types.collection.of(People);
      const people = new People([{ name: 'Fahad' }]);

      expect(type(people)).to.eql(people);
      expect(type([{ name: 'Name here' }])).to.be.instanceof(People);

      const Post = createModel({
        title: Types.string.isRequired
      });
      const Posts = createCollection(Post);

      const posts = new Posts([{ title: 'Hello World' }]);
      expect(() => type(posts)).to.throw(/value is not instance of expected Collection/);
    });
  });

  describe('Types :: enum', function () {
    it('accepts undefined unless required', function () {
      const type = Types.enum([1, 2, 3]);

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts enum values', function () {
      const type = Types.enum([1, 2, 3]);

      expect(type(1)).to.eql(1);
      expect(type(2)).to.eql(2);
      expect(type(3)).to.eql(3);
    });

    it('rejects non-enum values', function () {
      const type = Types.enum([1, 2, 3]);

      expect(() => type(0)).to.throw(/value is none of the provided enums/);
      expect(() => type(null)).to.throw(/value is none of the provided enums/);
      expect(() => type(true)).to.throw(/value is none of the provided enums/);
      expect(() => type(() => {})).to.throw(/value is none of the provided enums/);
      expect(() => type('hello')).to.throw(/value is none of the provided enums/);
    });

    it('checks for required values', function () {
      const type = Types.enum([1, 2, 3]).isRequired;

      expect(() => type()).to.throw(/value is not defined/);
      expect(type(1)).to.eql(1);
    });

    it('allows empty values when default is set', function () {
      const type = Types.enum([1, 2, 3]).defaults(2);

      expect(type()).to.eql(2);
      expect(type(3)).to.eql(3);
      expect(() => type('hello world')).to.throw(/value is none of the provided enums/);
    });

    it('accepts enum of types', function () {
      const type = Types.enum.of([
        Types.string,
        Types.number
      ]).isRequired;

      expect(type(1)).to.eql(1);
      expect(type(2)).to.eql(2);
      expect(type('hi')).to.eql('hi');
      expect(() => type({})).to.throw('value is none of the provided enum types');
    });
  });

  describe('Types :: func', function () {
    it('accepts undefined unless required', function () {
      const type = Types.func;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts function values', function () {
      const type = Types.func;

      const fn = () => {};
      expect(type(fn)).to.eql(fn);
    });

    it('rejects non-function values', function () {
      const type = Types.func;

      expect(() => type(0)).to.throw(/value is not a function/);
      expect(() => type(null)).to.throw(/value is not a function/);
      expect(() => type('hello world')).to.throw(/value is not a function/);
      expect(() => type({})).to.throw(/value is not a function/);
      expect(() => type([])).to.throw(/value is not a function/);
    });

    it('checks for required values', function () {
      const type = Types.func.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const defaultFunc = () => {};
      const type = Types.func.defaults(defaultFunc);

      expect(type()).to.eql(defaultFunc);
      expect(() => type(123)).to.throw(/value is not a function/);
    });
  });

  describe('Types :: model', function () {
    it('accepts undefined unless required', function () {
      const type = Types.model;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts model instances', function () {
      const type = Types.model;
      const Person = createModel({
        name: Types.string.isRequired
      });

      const person = new Person({ name: 'Fahad' });

      expect(type(person)).to.eql(person);
    });

    it('rejects non-model values', function () {
      const type = Types.model;

      expect(() => type('hello')).to.throw(/value is not a Model/);
      expect(() => type(null)).to.throw(/value is not a Model/);
      expect(() => type(true)).to.throw(/value is not a Model/);
      expect(() => type({})).to.throw(/value is not a Model/);
      expect(() => type(() => {})).to.throw(/value is not a Model/);
    });

    it('checks for required values', function () {
      const type = Types.model.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const Person = createModel({
        name: Types.string.isRequired
      });

      const person = new Person({ name: 'Fahad' });
      const type = Types.model.defaults(person);

      expect(type()).to.eql(person);

      const anotherPerson = new Person({ name: 'Dark Lord' });
      expect(type(anotherPerson)).to.eql(anotherPerson);
      expect(() => type('hello world')).to.throw(/value is not a Model/);
    });

    it('accepts model instances of certain Model', function () {
      const Person = createModel({
        name: Types.string.isRequired
      });
      const Post = createModel({
        title: Types.string.isRequired
      });

      const type = Types.model.of(Person);

      const person = new Person({ name: 'Fahad' });
      expect(type(person)).to.eql(person);
      expect(type({ name: 'Name here' })).to.be.instanceof(Person);

      const post = new Post({ title: 'Hello World' });
      expect(() => type(post)).to.throw(/value is not instance of expected Model/);
    });
  });

  describe('Types :: number', function () {
    it('accepts undefined unless required', function () {
      const type = Types.number;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts number values', function () {
      const type = Types.number;

      expect(type(123)).to.eql(123);
      expect(type(0)).to.eql(0);
    });

    it('rejects non-number values', function () {
      const type = Types.number;

      expect(() => type('hello')).to.throw(/value is not a number/);
      expect(() => type(null)).to.throw(/value is not a number/);
      expect(() => type(true)).to.throw(/value is not a number/);
      expect(() => type(() => {})).to.throw(/value is not a number/);
    });

    it('checks for required values', function () {
      const type = Types.number.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.number.defaults(123);

      expect(type()).to.eql(123);
      expect(type(345)).to.eql(345);
      expect(() => type('hello world')).to.throw(/value is not a number/);
    });
  });

  describe('Types :: object', function () {
    it('accepts undefined unless required', function () {
      const type = Types.object;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts object values', function () {
      const type = Types.object;

      expect(type({})).to.eql({});
      expect(type({a: 1, b: 2})).to.eql({a: 1, b: 2});
    });

    it('rejects non-object values', function () {
      const type = Types.object;

      expect(() => type(0)).to.throw(/value is not an object/);
      expect(() => type(null)).to.throw(/value is not an object/);
      expect(() => type(true)).to.throw(/value is not an object/);
      expect(() => type([])).to.throw(/value is not an object/);
      expect(() => type(() => {})).to.throw(/value is not an object/);
    });

    it('checks for required values', function () {
      const type = Types.object.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.object.defaults({hi: 'there'});

      expect(type()).to.eql({hi: 'there'});
      expect(type({hello: 'world'})).to.eql({hello: 'world'});
      expect(() => type(123)).to.throw(/value is not an object/);
    });

    it('checks for nested types', function () {
      const type = Types.object.of({
        street: Types.string,
        city: Types.string.isRequired,
        postalCode: Types.number.isRequired,
        country: Types.string.defaults('Netherlands')
      });

      expect(type({
        street: 'Amsterdam',
        city: 'Amsterdam',
        postalCode: 123
      })).to.eql({
        street: 'Amsterdam',
        city: 'Amsterdam',
        postalCode: 123,
        country: 'Netherlands'
      });

      expect(() => type({
        street: 'Amsterdam',
        city: 'Amsterdam',
        postalCode: '123'
      })).to.throw(/schema failed for key `postalCode`, value is not a number/);
    });

    it('checks for deep-nested types', function () {
      const type = Types.object.of({
        name: Types.string.isRequired,
        address: Types.object.of({
          street: Types.string,
          city: Types.string.isRequired,
          postalCode: Types.number.isRequired,
          country: Types.string.defaults('Netherlands')
        }).isRequired
      });

      expect(type({
        name: 'Fahad',
        address: {
          street: 'Amsterdam',
          city: 'Amsterdam',
          postalCode: 123
        }
      })).to.eql({
        name: 'Fahad',
        address: {
          street: 'Amsterdam',
          city: 'Amsterdam',
          postalCode: 123,
          country: 'Netherlands'
        }
      });

      expect(() => type({
        name: 'Fahad',
        address: {
          street: 'Amsterdam',
          city: 'Amsterdam',
          postalCode: '123'
        }
      })).to.throw(/schema failed for key `postalCode`, value is not a number/);
    });
  });

  describe('Types :: string', function () {
    it('accepts undefined unless required', function () {
      const type = Types.string;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts string values', function () {
      const type = Types.string;

      expect(type('hello')).to.eql('hello');
      expect(type('hello world')).to.eql('hello world');
      expect(type('')).to.eql('');
    });

    it('rejects non-string values', function () {
      const type = Types.string;

      expect(() => type(0)).to.throw(/value is not a string/);
      expect(() => type(null)).to.throw(/value is not a string/);
      expect(() => type(true)).to.throw(/value is not a string/);
      expect(() => type(() => {})).to.throw(/value is not a string/);
    });

    it('checks for required values', function () {
      const type = Types.string.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.string.defaults('hello');

      expect(type()).to.eql('hello');
      expect(type('something')).to.eql('something');
      expect(() => type(123)).to.throw(/value is not a string/);
    });
  });

  describe('Types :: uuid', function () {
    it('accepts undefined unless required', function () {
      const type = Types.uuid;

      expect(type()).to.be.an('undefined');
      expect(() => type.isRequired()).to.throw('value is not defined');
    });

    it('accepts UUIDs values', function () {
      const type = Types.uuid;

      expect(type('27961a0e-f4e8-4eb3-bf95-c5203e1d87b9')).to.eql('27961a0e-f4e8-4eb3-bf95-c5203e1d87b9');
      expect(type('90691cbc-b5ea-5826-ae98-951e30fc3b2d')).to.eql('90691cbc-b5ea-5826-ae98-951e30fc3b2d');
    });

    it('rejects non-UUID values', function () {
      const type = Types.uuid;

      expect(() => type('hello')).to.throw(/value is not a valid UUID/);
      expect(() => type(null)).to.throw(/value is not a valid UUID/);
      expect(() => type(true)).to.throw(/value is not a valid UUID/);
      expect(() => type(() => {})).to.throw(/value is not a valid UUID/);
    });

    it('checks for required values', function () {
      const type = Types.uuid.isRequired;

      expect(() => type()).to.throw(/value is not defined/);
    });

    it('allows empty values when default is set', function () {
      const type = Types.uuid.defaults('90691cbc-b5ea-5826-ae98-951e30fc3b2d');

      expect(type()).to.eql('90691cbc-b5ea-5826-ae98-951e30fc3b2d');
      expect(type('27961a0e-f4e8-4eb3-bf95-c5203e1d87b9')).to.eql('27961a0e-f4e8-4eb3-bf95-c5203e1d87b9');
      expect(() => type('hello world')).to.throw(/value is not a valid UUID/);
    });
  });
});
