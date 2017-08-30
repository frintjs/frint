/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it, window, document, beforeEach, resetDOM */
import { expect } from 'chai';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs';
import sinon from 'sinon';

import { createApp } from 'frint';

import render from '../render';
import observe from './observe';
import Region from './Region';
import RegionService from '../services/Region';
import streamProps from '../streamProps';

describe('frint-react › components › Region', function () {
  beforeEach(function () {
    resetDOM();
  });

  it('is a function', function () {
    expect(Region).to.be.a('function');
  });

  it('renders empty region when no root app available', function () {
    function MyComponent() {
      return (
        <div id="my-component">
          <Region name="left-sidebar" />
        </div>
      );
    }

    ReactDOM.render(
      <MyComponent />,
      document.getElementById('root')
    );

    const element = document.getElementById('my-component');
    expect(element.innerHTML.startsWith('<!-- react-empty: ')).to.equal(true);
    expect(element.innerHTML.endsWith(' -->')).to.equal(true);
  });

  it('renders apps with weighted ordering', function () {
    // root
    function RootComponent() {
      return (
        <div>
          <Region name="sidebar" />
        </div>
      );
    }
    const RootApp = createApp({
      name: 'RootApp',
      providers: [
        { name: 'component', useValue: RootComponent },
      ],
    });

    // apps
    function App1Component() {
      return <p>App 1</p>;
    }
    const App1 = createApp({
      name: 'App1',
      providers: [
        { name: 'component', useValue: App1Component },
      ],
    });

    function App2Component() {
      return <p>App 2</p>;
    }
    const App2 = createApp({
      name: 'App2',
      providers: [
        { name: 'component', useValue: App2Component },
      ],
    });

    // render
    window.app = new RootApp();
    render(
      window.app,
      document.getElementById('root')
    );

    // register apps
    window.app.registerApp(App1, {
      regions: ['sidebar'],
      weight: 10,
    });
    window.app.registerApp(App2, {
      regions: ['sidebar'],
      weight: 5,
    });

    // verify
    const paragraphs = document.querySelectorAll('p'); // @TODO: enzyme can be used?
    expect(paragraphs[0].innerHTML).to.equal('App 2');
    expect(paragraphs[1].innerHTML).to.equal('App 1');
  });

  it('warns when apps subscription emits an error', function () {
    // root
    function RootComponent() {
      return (
        <div>
          <Region name="sidebar" />
          <Region name="footer" />
        </div>
      );
    }
    const RootApp = createApp({
      name: 'RootApp',
      providers: [
        { name: 'component', useValue: RootComponent },
      ],
    });

    // fake an error
    window.app = new RootApp();
    const subject$ = new Subject();
    window.app.getApps$ = function getApps$() {
      return subject$;
    };

    // render
    render(
      window.app,
      document.getElementById('root')
    );

    // verify
    const stub = sinon.stub(console, 'warn');
    subject$.error(new Error('Something bad happened...'));

    sinon.assert.calledTwice(stub); // two Regions
  });

  it('renders single and multi-instance apps', function () {
    // root
    const todos = [
      { id: '1', title: 'First todo' },
      { id: '2', title: 'Second todo' },
      { id: '3', title: 'Third todo' },
    ];
    let rootComponentInstance; // @TODO: hack
    class RootComponent extends React.Component {
      render() {
        rootComponentInstance = this;

        return (
          <div>
            <p id="root-text">Hello World from Root</p>

            <Region name="sidebar" />

            <ul className="todos">
              {todos.map((todo) => {
                return (
                  <li key={`todo-item-${todo.id}`}>
                    {todo.title}

                    <Region
                      data={{ todo }}
                      name="todo-item"
                      uniqueKey={`todo-item-${todo.id}`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
    const RootApp = createApp({
      name: 'RootApp',
      providers: [
        { name: 'component', useValue: RootComponent },
      ],
    });

    // apps
    function App1Component() {
      return <p id="app1-text">Hello World from App1</p>;
    }
    const App1 = createApp({
      name: 'App1',
      providers: [
        { name: 'component', useValue: App1Component },
      ],
    });
    const App2Component = observe(function (app) {
      return streamProps()
        .set(
          app.get('region').getData$(),
          data => ({ todo: data.todo })
        )
        .get$();
    })(({ todo }) => (
      <p className="app2-text">Hello World from App2 - {todo.title}</p>
    ));
    const App2 = createApp({
      name: 'App2',
      providers: [
        { name: 'component', useValue: App2Component },
        { name: 'region', useClass: RegionService },
      ],
    });

    // render
    window.app = new RootApp();
    render(
      window.app,
      document.getElementById('root')
    );
    expect(document.getElementById('root-text').innerHTML).to.equal('Hello World from Root');

    // register apps
    window.app.registerApp(App1, {
      regions: ['sidebar'],
      weight: 0,
    });
    window.app.registerApp(App2, {
      regions: ['todo-item'],
      weight: 1,
      multi: true,
    });

    // verify single instance app
    expect(document.getElementById('app1-text').innerHTML).to.equal('Hello World from App1');

    // verify multi instance app
    const elements = _.toArray(document.getElementsByClassName('app2-text'));
    elements.forEach((el, index) => {
      expect(el.innerHTML).to.contain('Hello World from App2 - ');
      expect(el.innerHTML).to.contain(todos[index].title);
    });

    // change in props
    todos[1].title = 'Second todo [updated]';
    rootComponentInstance.forceUpdate();
    elements.forEach((el, index) => {
      expect(el.innerHTML).to.contain(todos[index].title);
    });

    // unmount
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    expect(_.toArray(document.getElementsByClassName('app2-text')).length).to.equal(0);
  });

  it('calls beforeDestroy when unmounting multi-instance apps', function () {
    // root
    const todos = [
      { id: '1', title: 'First todo' },
    ];
    let rootComponentInstance; // @TODO: hack
    class RootComponent extends React.Component {
      render() {
        rootComponentInstance = this;

        return (
          <div>
            <p id="root-text">Hello World from Root</p>

            <Region name="sidebar" />

            <ul className="todos">
              {todos.map((todo) => {
                return (
                  <li key={`todo-item-${todo.id}`}>
                    {todo.title}

                    <Region
                      data={{ todo }}
                      name="todo-item"
                      uniqueKey={`todo-item-${todo.id}`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
    const RootApp = createApp({
      name: 'RootApp',
      providers: [
        { name: 'component', useValue: RootComponent },
      ],
    });

    // app
    const AppComponent = observe(function (app) {
      return streamProps()
        .set(
          app.get('region').getData$(),
          data => ({ todo: data.todo })
        )
        .get$();
    })(({ todo }) => (
      <p className="app-text">Hello World from App - {todo.title}</p>
    ));
    let beforeDestroyCalled = false;
    const App = createApp({
      name: 'App',
      beforeDestroy: function () {
        beforeDestroyCalled = true;
      },
      providers: [
        { name: 'component', useValue: AppComponent },
        { name: 'region', useClass: RegionService },
      ],
    });

    // render
    window.app = new RootApp();
    render(
      window.app,
      document.getElementById('root')
    );
    expect(document.getElementById('root-text').innerHTML).to.equal('Hello World from Root');

    // register app
    window.app.registerApp(App, {
      regions: ['todo-item'],
      multi: true,
    });

    // verify multi instance app
    const elements = _.toArray(document.getElementsByClassName('app-text'));
    elements.forEach((el, index) => {
      expect(el.innerHTML).to.contain('Hello World from App - ');
      expect(el.innerHTML).to.contain(todos[index].title);
    });

    // rootApp should have the instance
    expect(window.app.getAppInstance('App', 'todo-item', 'todo-item-1')).to.not.equal(null);

    // change in props
    todos.pop(); // empty the list
    rootComponentInstance.forceUpdate();
    const updatedElements = _.toArray(document.getElementsByClassName('app-text'));
    expect(updatedElements.length).to.equal(0);

    // check if beforeDestroy was called
    expect(beforeDestroyCalled).to.equal(true);

    // rootApp should not have the instance any more
    expect(window.app.getAppInstance('App', 'todo-item', 'todo-item-1')).to.equal(null);
  });
});
