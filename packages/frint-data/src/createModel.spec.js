/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

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
      name: 'Fahad'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.eql('Fahad');
    expect(model.language).to.eql('English');
  });

  it('disables instance property mutations', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
        language: Types.string.defaults('English')
      },
    });

    const model = new Model({
      name: 'Fahad'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.eql('Fahad');

    expect(model.name).to.eql('Fahad');
  });

  it('makes only attributes enumerable', function () {
    const Model = createModel({
      schema: {
        name: Types.string.isRequired,
        language: Types.string.defaults('English'),
      },
    });

    const model = new Model({
      name: 'Fahad'
    });

    expect(Object.keys(model)).to.eql(['name', 'language']);
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
      name: 'Fahad',
      address: {
        street: 'Straat',
        city: 'Amsterdam'
      }
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.eql('Fahad');
    expect(model.address.street).to.eql('Straat');
    expect(model.address.city).to.eql('Amsterdam');
    expect(model.address).to.eql({
      street: 'Straat',
      city: 'Amsterdam'
    });

    expect(model.address.street).to.eql('Straat');

    expect(model.address).to.eql({
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
      name: 'Fahad'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.name).to.eql('Fahad');
    expect(model.setName).to.be.a('function');

    expect(model.getName()).to.eql('Fahad');

    model.setName('Heylaal');
    expect(model.name).to.eql('Heylaal');
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
      firstName: 'Fahad',
      lastName: 'Heylaal'
    });

    expect(model).to.be.instanceof(Model);
    expect(model.firstName).to.eql('Fahad');
    expect(model.lastName).to.eql('Heylaal');

    expect(model.getFirstName).to.be.a('function');
    expect(model.getFirstName()).to.eql('Fahad');

    expect(model.getLastName).to.be.a('function');
    expect(model.getLastName()).to.eql('Heylaal');

    expect(model.getFullName()).to.eql('Fahad Heylaal');

    model.setFirstName('John');
    model.setLastName('Smith');
    expect(model.getFullName()).to.eql('John Smith');

    model.setFullName('Foo', 'Bar');
    expect(model.getFullName()).to.eql('Foo Bar');
  });

  it('throws error when method name conflicts', function () {
    const Person = createModel({
      schema: {
        name: Types.string,
        bio: Types.string,
      },
      name() {
        return true;
      },
    });

    function getPerson() {
      new Person({  // eslint-disable-line
        name: 'Fahad',
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
      toJS() {
        return true;
      },
    });

    function getPerson() {
      new Person({  // eslint-disable-line
        name: 'Fahad',
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
      getStreet() {
        return this.street;
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
      getName() {
        return this.name;
      },
      getStreet() {
        return this.address.getStreet();
      },
    });

    const person = new Person({
      name: 'Fahad',
      address: {
        street: 'Straat',
        country: 'Netherlands'
      }
    });

    expect(person).to.be.instanceof(Person);
    expect(person.address).to.be.instanceof(Address);
    expect(isModel(person.address)).to.eql(true);

    expect(person.name).to.eql('Fahad');
    expect(person.address.street).to.eql('Straat');
    expect(person.address.country).to.eql('Netherlands');
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
      name: 'Fahad'
    });

    expect(person.name).to.eql('Fahad');

    person.setName('Fahad [updated]');
    expect(person.name).to.eql('Fahad [updated]');

    function changeName() {
      person.setName(123);
    }

    expect(changeName).to.throw(/value is not a string/);
    expect(person.name).to.eql('Fahad [updated]');
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

    expect(harry.name).to.eql('Harry');
    expect(hermione.name).to.eql('Hermione');
    expect(ron.name).to.eql('Ron');
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

    expect(counter.value).to.eql(-1);
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
      name: 'Fahad',
      posts: [
        { title: 'Hello World' },
        { title: 'About' },
        { title: 'Contact' }
      ]
    });

    expect(author.name).to.eql('Fahad');
    expect(isCollection(author.posts)).to.eql(true);

    expect(isModel(author.posts.at(0)));
    expect(author.posts.at(0).title).to.eql('Hello World');

    expect(isModel(author.posts.at(1)));
    expect(author.posts.at(1).title).to.eql('About');

    expect(isModel(author.posts.at(2)));
    expect(author.posts.at(2).title).to.eql('Contact');

    const about = author.posts.at(1);
    about.setTitle('About Us');

    expect(about.title).to.eql('About Us');
    expect(author.posts.at(1).title).to.eql('About Us');
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
      name: 'Fahad'
    });

    person.get$() // 1
      .take(3)
      .last()
      .subscribe(function (p) {
        expect(p.name).to.equal('Fahad changed again');

        done();
      });

    person.setName('Fahad changed'); // 2
    person.setName('Fahad changed again'); // 3
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
      setName(name) {
        this.name = name;
      },
    });

    const person = new Person({
      name: 'Fahad',
      address: {
        street: 'Straat',
        city: 'Amsterdam'
      }
    });

    person.get$()
      .take(3)
      .last()
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
      setTitle(title) {
        this.title = title;
      },
    });

    const Books = createCollection({
      model: Book,
      addBook(title) {
        this.push(new Book({
          title
        }));
      }
    });

    const Author = createModel({
      schema: {
        name: Types.string.isRequired,
        books: Types.collection.of(Books),
      },
    });

    const author = new Author({
      name: 'Fahad',
      books: []
    });

    author.get$()
      .take(3)
      .last()
      .subscribe(function (a) {
        expect(a.books.length).to.equal(2);

        done();
      });

    author.books.addBook('My New Book');
    author.books.push(new Book({ title: 'Another Book' }));
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
      expect(isEvent(event)).to.eql(true);
      expect(event.path).to.eql(['title']);
      expect(book.title).to.eql('Harry Potter and The Prisoner of Azkaban');

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
        expect(isEvent(event)).to.eql(true);
        expect(event.path).to.eql(['address', 'street']);
        expect(model.address.street).to.eql('4 Privet Drive');
        expect(model.getIn(event.path)).to.eql('4 Privet Drive');

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
        expect(isEvent(event)).to.eql(true);
        expect(event.path).to.eql(['books', 0, 'title']);
        expect(model.books.at(0).title).to.eql('The Life and Lies of Albus Dumbledore');
        expect(model.getIn(event.path)).to.eql('The Life and Lies of Albus Dumbledore');

        firstSubscription.unsubscribe();
      });

    author.books.at(0).setTitle('The Life and Lies of Albus Dumbledore');

    // second change
    const secondSubscription = author.listen$('change')
      .subscribe(function ({ model, event }) {
        expect(isEvent(event)).to.eql(true);
        expect(event.path).to.eql(['books', 1]);
        expect(model.books.at(1).title).to.eql(`Dumbledore's Army`);
        expect(model.getIn(event.path)).to.eql(model.books.at(1));

        secondSubscription.unsubscribe();
        done();
      });

    author.books.push(new Book({
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

    expect(person.name).to.eql('Updated by initialize');
  });

  describe('Model :: get()', function () {
    it('gets value by path from self', function (done) {
      const Person = createModel({
        schema: {
          name: Types.string,
        },
      });

      const person = new Person({ name: 'Newt Scamander' });

      expect(person.get('name')).to.eql('Newt Scamander');

      person.get$('name')
        .subscribe(function (name) {
          expect(name).to.eql('Newt Scamander');

          done();
        });
    });

    it('gets value by dot-separated path from child-model', function () {
      const Address = createModel({
        schema: {
          street: Types.string,
          city: Types.string,
        },
        setStreet(street) {
          this.street = street;
        }
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

      expect(isModel(person.get('address'))).to.eql(true);
      expect(person.get('address')).to.eql(person.address);
      expect(person.get('address.city')).to.eql('Surrey');
    });

    it('gets value by dot-separated path from child-collection', function () {
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

      expect(author.get('books')).to.eql(author.books);
      expect(author.get('books.0')).to.eql(author.books.at(0));
      expect(author.get('books.0.title')).to.eql('The Life and Lies of Dumbledore');
      expect(author.get('books.1')).to.eql(author.books.at(1));
      expect(author.get('books.1.title')).to.eql(`Dumbledore's Army`);
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

      expect(person.getIn(['name'])).to.eql('Newt Scamander');

      person.getIn$(['name'])
        .subscribe(function (name) {
          expect(name).to.eql('Newt Scamander');

          done();
        });
    });

    it('gets value by path from child-model', function () {
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

      expect(isModel(person.getIn(['address']))).to.eql(true);
      expect(person.getIn(['address'])).to.eql(person.address);
      expect(person.getIn(['address', 'city'])).to.eql('Surrey');
    });

    it('gets value by path from child-collection', function () {
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

      expect(author.getIn(['books'])).to.eql(author.books);
      expect(author.getIn(['books', 0])).to.eql(author.books.at(0));
      expect(author.getIn(['books', 0, 'title'])).to.eql('The Life and Lies of Dumbledore');
      expect(author.getIn(['books', 1])).to.eql(author.books.at(1));
      expect(author.getIn(['books', 1, 'title'])).to.eql(`Dumbledore's Army`);
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

      expect(model.toJS()).to.eql({ name: 'Blah' });

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

      expect(isModel(person.address)).to.eql(true);

      expect(person.toJS()).to.eql({
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

      expect(todo.toJS()).to.eql({
        id: 1,
        title: 'My first todo'
      });
    });
  });
});
