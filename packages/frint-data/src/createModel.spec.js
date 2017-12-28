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
import isEvent from './isEvent';

describe('frint-data › createModel', function () {
  it('creates Model class', function () {
    const Model = createModel();
    const model = new Model();

    expect(model).to.be.instanceof(Model);
  });

  it('creates Model class with types', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
        language: Types.string.defaults('English'),
      },
    });

    const model = new Model({
      name: 'Rubeus'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.equal('Rubeus');
    expect(model.language).to.equal('English');
  });

  it('disables instance property mutations', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
        language: Types.string.defaults('English')
      },
    });

    const model = new Model({
      name: 'Rubeus'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.equal('Rubeus');

    expect(model.name).to.equal('Rubeus');
  });

  it('makes only attributes enumerable', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
        language: Types.string.defaults('English'),
      },
    });

    const model = new Model({
      name: 'Rubeus'
    });

    expect(Object.keys(model)).to.deep.equal(['name', 'language']);
  });

  it('creates Model class with nested types', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
        address: Types.object.of({
          street: Types.string,
          city: Types.string,
        }),
      },
    });

    const model = new Model({
      name: 'Rubeus',
      address: {
        street: 'Straat',
        city: 'Amsterdam'
      }
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.equal('Rubeus');
    expect(model.address.street).to.equal('Straat');
    expect(model.address.city).to.equal('Amsterdam');
    expect(model.address).to.deep.equal({
      street: 'Straat',
      city: 'Amsterdam'
    });

    expect(model.address.street).to.equal('Straat');

    expect(model.address).to.deep.equal({
      street: 'Straat',
      city: 'Amsterdam'
    });
  });

  it('creates Model class with methods', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
      },
      getName() {
        return this.name;
      },
      setName(name) {
        this.name = name;
      },
    });

    const model = new Model({
      name: 'Rubeus'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.equal('Rubeus');
    expect(model.setName).to.be.a('function');

    expect(model.getName()).to.equal('Rubeus');

    model.setName('Hagrid');
    expect(model.name).to.equal('Hagrid');
  });

  it('allows methods to call other methods', function () {
    const Model = createModel({
      schema: {
        firstName: Types.string.isRequired,
        lastName: Types.string.isRequired,
      },
      // first
      getFirstName() {
        return this.firstName;
      },
      setFirstName(firstName) {
        this.firstName = firstName;
      },

      // last
      getLastName() {
        return this.lastName;
      },
      setLastName(lastName) {
        this.lastName = lastName;
      },

      // full
      getFullName() {
        return `${this.getFirstName()} ${this.getLastName()}`;
      },
      setFullName(firstName, lastName) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
      },
    });

    const model = new Model({
      firstName: 'Rubeus',
      lastName: 'Hagrid'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.firstName).to.equal('Rubeus');
    expect(model.lastName).to.equal('Hagrid');

    expect(model.getFirstName).to.be.a('function');
    expect(model.getFirstName()).to.equal('Rubeus');

    expect(model.getLastName).to.be.a('function');
    expect(model.getLastName()).to.equal('Hagrid');

    expect(model.getFullName()).to.equal('Rubeus Hagrid');

    model.setFirstName('John');
    model.setLastName('Smith');
    expect(model.getFullName()).to.equal('John Smith');

    model.setFullName('Foo', 'Bar');
    expect(model.getFullName()).to.equal('Foo Bar');
  });

  it('throws error when method name conflicts', function () {
    const Person = createModel({
      schema: {
        name: Types.string,
        bio: Types.string,
      },
      name() { /* istanbul ignore next */
        return true;
      },
    });

    function getPerson() {
      new Person({  // eslint-disable-line
        name: 'Rubeus',
        bio: 'blah...'
      });
    }

    expect(getPerson).to.throw(/conflicting method name: name/);
  });

  it('throws error when method name conflicts with built-in methods', function () {
    const Person = createModel({
      schema: {
        name: Types.string,
        bio: Types.string,
      },
      toJS() { /* istanbul ignore next */
        return true;
      },
    });

    function getPerson() {
      new Person({  // eslint-disable-line
        name: 'Rubeus',
        bio: 'blah...'
      });
    }

    expect(getPerson).to.throw(/conflicting method name: toJS/);
  });


  it('embeds other models', function () {
    const Address = createModel({
      schema: {
        street: Types.string,
        country: Types.string,
      },
    });

    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
        address: Types.model.of(Address),
      },
    });

    const person = new Person({
      name: 'Rubeus',
      address: {
        street: 'Straat',
        country: 'Netherlands'
      }
    });

    expect(person).to.be.instanceof(Person);
    expect(person.address).to.be.instanceof(Address);
    expect(isModel(person.address)).to.equal(true);

    expect(person.name).to.equal('Rubeus');
    expect(person.address.street).to.equal('Straat');
    expect(person.address.country).to.equal('Netherlands');
  });

  it('checks for types on re-assignments', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
      setName(name) {
        this.name = name;
      },
    });

    const person = new Person({
      name: 'Rubeus'
    });

    expect(person.name).to.equal('Rubeus');

    person.setName('Frint [updated]');
    expect(person.name).to.equal('Frint [updated]');

    function changeName() {
      person.setName(123);
    }

    expect(changeName).to.throw(/value is not a string/);
    expect(person.name).to.equal('Frint [updated]');
  });

  it('checks with multiple model instances', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
    });

    const harry = new Person({ name: 'Harry' });
    const hermione = new Person({ name: 'Hermione' });
    const ron = new Person({ name: 'Ron' });

    expect(harry.name).to.equal('Harry');
    expect(hermione.name).to.equal('Hermione');
    expect(ron.name).to.equal('Ron');
  });

  it('sets falsy values', function () {
    const Counter = createModel({
      schema: {
        value: Types.number.isRequired,
      },
      increment() {
        this.value += 1;
      },
      decrement() {
        this.value -= 1;
      },
    });

    const counter = new Counter({ value: 0 });

    counter.increment();
    counter.increment();

    counter.decrement();
    counter.decrement();
    counter.decrement();

    expect(counter.value).to.equal(-1);
  });

  it('embeds collections', function () {
    const Post = createModel({
      schema: {
        title: Types.string.isRequired,
      },
      setTitle(newTitle) {
        this.title = newTitle;
      },
    });

    const Posts = createCollection({
      model: Post,
    });

    const Author = createModel({
      schema: {
        name: Types.string.isRequired,
        posts: Types.collection.of(Posts),
      },
    });

    const author = new Author({
      name: 'Rubeus',
      posts: [
        { title: 'Hello World' },
        { title: 'About' },
        { title: 'Contact' }
      ]
    });

    expect(author.name).to.equal('Rubeus');
    expect(isCollection(author.posts)).to.equal(true);

    expect(isModel(author.posts.at(0)));
    expect(author.posts.at(0).title).to.equal('Hello World');

    expect(isModel(author.posts.at(1)));
    expect(author.posts.at(1).title).to.equal('About');

    expect(isModel(author.posts.at(2)));
    expect(author.posts.at(2).title).to.equal('Contact');

    const about = author.posts.at(1);
    about.setTitle('About Us');

    expect(about.title).to.equal('About Us');
    expect(author.posts.at(1).title).to.equal('About Us');

    author.destroy();
  });

  it('listens for self assignments', function (done) {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
      setName(name) {
        this.name = name;
      },
    });

    const person = new Person({
      name: 'Rubeus'
    });

    person.get$() // 1
      .pipe(
        take$(3),
        last$()
      )
      .subscribe(function (p) {
        expect(p.name).to.equal('Frint changed again');

        done();
      });

    person.setName('Frint changed'); // 2
    person.setName('Frint changed again'); // 3
  });

  it('listens for child-model assignments', function (done) {
    const Address = createModel({
      schema: {
        street: Types.string.isRequired,
        city: Types.string.isRequired,
      },
      setStreet(street) {
        this.street = street;
      },
    });

    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
        address: Types.model.of(Address),
      },
    });

    const person = new Person({
      name: 'Rubeus',
      address: {
        street: 'Straat',
        city: 'Amsterdam'
      }
    });

    person.get$()
      .pipe(
        take$(3),
        last$()
      )
      .subscribe(function (p) {
        expect(p.address.street).to.equal('New Street Again');

        done();
      });

    person.address.setStreet('New Street');
    person.address.setStreet('New Street Again');
  });

  it('listens for child-collection changes', function (done) {
    const Book = createModel({
      schema: {
        title: Types.string.isRequired,
      },
    });

    const Books = createCollection({
      model: Book,
      addBook(title) {
        this.push(new Book({
          title
        }));
      },
      customPush(m) {
        return this.push(m);
      },
    });

    const Author = createModel({
      schema: {
        name: Types.string.isRequired,
        books: Types.collection.of(Books),
      },
    });

    const author = new Author({
      name: 'Rubeus',
      books: []
    });

    author.get$()
      .pipe(
        take$(3),
        last$()
      )
      .subscribe(function (a) {
        expect(a.books.length).to.equal(2);

        done();
      });

    author.books.addBook('My New Book');
    author.books.customPush(new Book({ title: 'Another Book' }));
  });

  it('emits `change` event with Event object for self', function (done) {
    const Book = createModel({
      schema: {
        title: Types.string.isRequired,
      },
      setTitle(title) {
        this.title = title;
      },
    });

    const book = new Book({ title: 'Prisoner of Azkaban' });

    book._on('change', function (event) {
      expect(isEvent(event)).to.equal(true);
      expect(event.path).to.deep.equal(['title']);
      expect(book.title).to.equal('Harry Potter and The Prisoner of Azkaban');

      done();
    });

    book.setTitle('Harry Potter and The Prisoner of Azkaban');
  });

  it('emits `change` event with Event object for child-model', function (done) {
    const Address = createModel({
      schema: {
        street: Types.string,
        city: Types.string,
      },
      setStreet(street) {
        this.street = street;
      },
    });

    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
        address: Types.model.of(Address),
      },
    });

    const person = new Person({
      name: 'Vernon Dursley',
      address: {
        street: 'Privet Drive',
        city: 'Surrey'
      }
    });

    person.listen$('change')
      .subscribe(function ({ model, event }) {
        expect(isEvent(event)).to.equal(true);
        expect(event.path).to.deep.equal(['address', 'street']);
        expect(model.address.street).to.equal('4 Privet Drive');
        expect(model.getIn(event.path)).to.equal('4 Privet Drive');

        done();
      });

    person.address.setStreet('4 Privet Drive');
  });

  it('emits `change` event with Event object for child-collection', function (done) {
    const Book = createModel({
      schema: {
        title: Types.string.isRequired,
      },
      setTitle(title) {
        this.title = title;
      },
    });

    const Books = createCollection({
      model: Book,

      customPush(m) {
        return this.push(m);
      },
    });

    const Author = createModel({
      schema: {
        name: Types.string.isRequired,
        books: Types.collection.of(Books),
      },
    });

    const author = new Author({
      name: 'Rita Skeeter',
      books: [
        { title: 'The Life and Lies of Dumbledore' }
      ]
    });

    // first change
    const firstSubscription = author.listen$('change')
      .subscribe(function ({ model, event }) {
        expect(isEvent(event)).to.equal(true);
        expect(event.path).to.deep.equal(['books', 0, 'title']);
        expect(model.books.at(0).title).to.equal('The Life and Lies of Albus Dumbledore');
        expect(model.getIn(event.path)).to.equal('The Life and Lies of Albus Dumbledore');

        firstSubscription.unsubscribe();
      });

    author.books.at(0).setTitle('The Life and Lies of Albus Dumbledore');

    // second change
    const secondSubscription = author.listen$('change')
      .subscribe(function ({ model, event }) {
        expect(isEvent(event)).to.equal(true);
        expect(event.path).to.deep.equal(['books', 1]);
        expect(model.books.at(1).title).to.equal(`Dumbledore's Army`);
        expect(model.getIn(event.path)).to.equal(model.books.at(1));

        secondSubscription.unsubscribe();
        done();
      });

    author.books.customPush(new Book({
      title: `Dumbledore's Army`
    }));
  });

  it('applies initilize', function () {
    const Person = createModel({
      schema: {
        name: Types.string.isRequired,
      },
      initialize() {
        this.setName('Updated by initialize');
      },
      setName(name) {
        this.name = name;
      },
    });

    const person = new Person({
      name: 'Initial name'
    });

    expect(person.name).to.equal('Updated by initialize');
  });

  it('can work with date objects', function () {
    const CalendarEvent = createModel({
      schema: {
        start: Types.date,
        end: Types.date,
        created: Types.date,
        updated: Types.date,
      },
    });

    const d1 = new Date();
    const d2 = 'Mon Dec 25 2017 12:00:00 GMT+0000';
    const d3 = undefined;
    const d4 = d1.toString();

    const calendarEvent = new CalendarEvent({
      start: d1,
      end: d2,
      created: d3,
      updated: d4,
    });

    expect(isModel(calendarEvent)).to.equal(true);

    // model values
    expect(calendarEvent.start).to.deep.equal(d1);
    expect(calendarEvent.end).to.be.an.instanceof(Date);
    expect(calendarEvent.created).to.equal(undefined);
    expect(calendarEvent.updated).to.be.an.instanceof(Date);

    // plain values
    const calendarEventObj = calendarEvent.toJS();
    const pattern = /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}T(.*)$/;
    expect(calendarEventObj.start).to.match(pattern);
    expect(calendarEventObj.end).to.match(pattern);
    expect(calendarEventObj.created).to.equal(undefined);
    expect(calendarEventObj.updated).to.match(pattern);
  });

  describe('Model :: get()', function () {
    it('gets value by path from self', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string,
        },
      });

      const person = new Person({ name: 'Newt Scamander' });

      expect(person.get('name')).to.equal('Newt Scamander');

      person.get$('name')
        .subscribe(function (name) {
          expect(name).to.equal('Newt Scamander');

          done();
        });
    });

    it('gets value by dot-separated path from child-model', function () {
      const Address = createModel({
        schema: {
          street: Types.string,
          city: Types.string,
        },
      });

      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
          address: Types.model.of(Address),
        },
      });

      const person = new Person({
        name: 'Vernon Dursley',
        address: {
          street: 'Privet Drive',
          city: 'Surrey'
        }
      });

      expect(isModel(person.get('address'))).to.equal(true);
      expect(person.get('address')).to.equal(person.address);
      expect(person.get('address.city')).to.equal('Surrey');
    });

    it('gets value by dot-separated path from child-collection', function () {
      const Book = createModel({
        schema: {
          title: Types.string.isRequired,
        },
      });

      const Books = createCollection({
        model: Book,
      });

      const Author = createModel({
        schema: {
          name: Types.string.isRequired,
          books: Types.collection.of(Books),
        },
      });

      const author = new Author({
        name: 'Rita Skeeter',
        books: [
          { title: 'The Life and Lies of Dumbledore' },
          { title: `Dumbledore's Army` }
        ]
      });

      expect(author.get('books')).to.equal(author.books);
      expect(author.get('books.0')).to.equal(author.books.at(0));
      expect(author.get('books.0.title')).to.equal('The Life and Lies of Dumbledore');
      expect(author.get('books.1')).to.equal(author.books.at(1));
      expect(author.get('books.1.title')).to.equal(`Dumbledore's Army`);
    });
  });

  describe('Model :: getIn()', function () {
    it('gets value by path from self', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string,
        },
      });

      const person = new Person({ name: 'Newt Scamander' });

      expect(person.getIn(['name'])).to.equal('Newt Scamander');

      person.getIn$(['name'])
        .subscribe(function (name) {
          expect(name).to.equal('Newt Scamander');

          done();
        });
    });

    it('gets value by path from child-model', function () {
      const Address = createModel({
        schema: {
          street: Types.string,
          city: Types.string,
        },
      });

      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
          address: Types.model.of(Address),
        },
      });

      const person = new Person({
        name: 'Vernon Dursley',
        address: {
          street: 'Privet Drive',
          city: 'Surrey'
        }
      });

      expect(isModel(person.getIn(['address']))).to.equal(true);
      expect(person.getIn(['address'])).to.equal(person.address);
      expect(person.getIn(['address', 'city'])).to.equal('Surrey');
    });

    it('gets value by path from child-collection', function () {
      const Book = createModel({
        schema: {
          title: Types.string.isRequired,
        },
      });

      const Books = createCollection({
        model: Book,
      });

      const Author = createModel({
        schema: {
          name: Types.string.isRequired,
          books: Types.collection.of(Books),
        },
      });

      const author = new Author({
        name: 'Rita Skeeter',
        books: [
          { title: 'The Life and Lies of Dumbledore' },
          { title: `Dumbledore's Army` }
        ]
      });

      expect(author.getIn(['books'])).to.equal(author.books);
      expect(author.getIn(['books', 0])).to.equal(author.books.at(0));
      expect(author.getIn(['books', 0, 'title'])).to.equal('The Life and Lies of Dumbledore');
      expect(author.getIn(['books', 1])).to.equal(author.books.at(1));
      expect(author.getIn(['books', 1, 'title'])).to.equal(`Dumbledore's Army`);
    });
  });

  describe('Model :: toJS()', function () {
    it('converts simple Model\'s attributes to plain object', function (done) {
      const Model = createModel({
        schema: {
          name: Types.string.isRequired,
        },
      });
      const model = new Model({
        name: 'Blah'
      });

      expect(model.toJS()).to.deep.equal({ name: 'Blah' });

      model.toJS$()
        .subscribe(function (obj) {
          expect(obj).to.deep.equal({ name: 'Blah' });

          done();
        });
    });

    it('converts nested Model\'s attributes to plain object', function () {
      const Address = createModel({
        schema: {
          street: Types.string.isRequired,
        },
      });

      const Person = createModel({
        schema: {
          name: Types.string.isRequired,
          address: Types.model.of(Address),
        },
      });

      const person = new Person({
        name: 'Blah',
        address: {
          street: 'Straat'
        }
      });

      expect(isModel(person.address)).to.equal(true);

      expect(person.toJS()).to.deep.equal({
        name: 'Blah',
        address: {
          street: 'Straat'
        }
      });
    });

    it('returns plain object based strictly on schema', function () {
      const Todo = createModel({
        schema: {
          id: Types.number.isRequired,
          title: Types.string.isRequired,
        },
      });

      const todo = new Todo({
        id: 1,
        title: 'My first todo',
        x: 'x'
      });

      todo.y = 'y';

      expect(todo.toJS()).to.deep.equal({
        id: 1,
        title: 'My first todo'
      });
    });
  });
});
