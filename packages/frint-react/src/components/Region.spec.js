/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it, before, beforeEach, afterEach, window, document, resetDOM */
import { expect } from 'chai';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs';
import sinon from 'sinon';

import { createCore, createWidget } from 'frint';

import render from '../render';
import observe from './observe';
import Region from './Region';
import RegionService from '../services/Region';
import streamProps from '../streamProps';

describe('frint-react › components › Region', function () {
  it('is a function', function () {
    expect(Region).to.be.a('function');
  });

  it('renders empty region when no root app available', function () {
    const MyComponent = React.createClass({
      render() {
        return (
          <div id="my-component">
            <Region name="left-sidebar" />
          </div>
        );
      }
    });

    ReactDOM.render(
      <MyComponent />,
      document.getElementById('root')
    );

    const element = document.getElementById('my-component');
    expect(element.innerHTML.startsWith('<noscript ')).to.equal(true);
    expect(element.innerHTML.endsWith('</noscript>')).to.equal(true);
  });

  it('renders widgets with weighted ordering', function () {
    resetDOM();

    // core
    const CoreComponent = React.createClass({
      render() {
        return (
          <div>
            <Region name="sidebar" />
          </div>
        );
      }
    });
    const Core = createCore({
      name: 'CoreApp',
      providers: [
        { name: 'component', useValue: CoreComponent },
      ],
    });

    // widgets
    const Widget1Component = React.createClass({
      render() {
        return <p>Widget 1</p>;
      }
    });
    const Widget1 = createWidget({
      name: 'Widget1',
      providers: [
        { name: 'component', useValue: Widget1Component },
      ],
    });

    const Widget2Component = React.createClass({
      render() {
        return <p>Widget 2</p>;
      }
    });
    const Widget2 = createWidget({
      name: 'Widget2',
      providers: [
        { name: 'component', useValue: Widget2Component },
      ],
    });

    // render
    window.app = new Core();
    render(
      window.app,
      document.getElementById('root')
    );

    // register widgets
    window.app.registerWidget(Widget1, {
      regions: ['sidebar'],
      weight: 10,
    });
    window.app.registerWidget(Widget2, {
      regions: ['sidebar'],
      weight: 5,
    });

    // verify
    const paragraphs = document.querySelectorAll('p'); // @TODO: enzyme can be used?
    expect(paragraphs[0].innerHTML).to.equal('Widget 2');
    expect(paragraphs[1].innerHTML).to.equal('Widget 1');
  });

  it('warns when widgets subscription emits an error', function () {
    // core
    const CoreComponent = React.createClass({
      render() {
        return (
          <div>
            <Region name="sidebar" />
            <Region name="footer" />
          </div>
        );
      }
    });
    const Core = createCore({
      name: 'CoreApp',
      providers: [
        { name: 'component', useValue: CoreComponent },
      ],
    });

    // fake an error
    window.app = new Core();
    const subject$ = new Subject();
    window.app.getWidgets$ = function getWidgets$() {
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

  it('renders single and multi-instance widgets', function () {
    // core
    const todos = [
      { id: '1', title: 'First todo' },
      { id: '2', title: 'Second todo' },
      { id: '3', title: 'Third todo' },
    ];
    let coreComponentInstance; // @TODO: hack
    const CoreComponent = React.createClass({
      render() {
        coreComponentInstance = this;

        return (
          <div>
            <p id="core-text">Hello World from Core</p>

            <Region name="sidebar" />

            <ul classNames="todos">
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
    });
    const Core = createCore({
      name: 'CoreApp',
      providers: [
        { name: 'component', useValue: CoreComponent },
      ],
    });

    // widgets
    const Widget1Component = React.createClass({
      render() {
        return <p id="widget1-text">Hello World from Widget1</p>;
      }
    });
    const Widget1 = createWidget({
      name: 'Widget1',
      providers: [
        { name: 'component', useValue: Widget1Component },
      ],
    });
    const Widget2Component = observe(function (app) {
      return streamProps()
        .set(
          app.get('region').getData$(),
          data => ({ todo: data.todo })
        )
        .get$();
    })(React.createClass({
      render() {
        return <p className="widget2-text">Hello World from Widget2 - {this.props.todo.title}</p>;
      }
    }));
    const Widget2 = createWidget({
      name: 'Widget2',
      providers: [
        { name: 'component', useValue: Widget2Component },
        { name: 'region', useClass: RegionService },
      ],
    });

    // render
    window.app = new Core();
    render(
      window.app,
      document.getElementById('root')
    );
    expect(document.getElementById('core-text').innerHTML).to.equal('Hello World from Core');

    // register widget
    window.app.registerWidget(Widget1, {
      regions: ['sidebar'],
      weight: 0,
    });
    window.app.registerWidget(Widget2, {
      regions: ['todo-item'],
      weight: 1,
      multi: true,
    });

    // verify single instance widget
    expect(document.getElementById('widget1-text').innerHTML).to.equal('Hello World from Widget1');

    // verify multi instance widget
    const elements = _.toArray(document.getElementsByClassName('widget2-text'));
    elements.forEach((el, index) => {
      expect(el.innerHTML).to.contain('Hello World from Widget2 - ');
      expect(el.innerHTML).to.contain(todos[index].title);
    });

    // change in props
    todos[1].title = 'Second todo [updated]';
    coreComponentInstance.forceUpdate();
    elements.forEach((el, index) => {
      expect(el.innerHTML).to.contain(todos[index].title);
    });

    // unmount
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    expect(_.toArray(document.getElementsByClassName('widget2-text')).length).to.equal(0);
  });

  it('calls beforeDestroy when unmounting multi-instance widgets', function () {
    // core
    const todos = [
      { id: '1', title: 'First todo' },
    ];
    let coreComponentInstance; // @TODO: hack
    const CoreComponent = React.createClass({
      render() {
        coreComponentInstance = this;

        return (
          <div>
            <p id="core-text">Hello World from Core</p>

            <Region name="sidebar" />

            <ul classNames="todos">
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
    });
    const Core = createCore({
      name: 'CoreApp',
      providers: [
        { name: 'component', useValue: CoreComponent },
      ],
    });

    // widget
    const WidgetComponent = observe(function (app) {
      return streamProps()
        .set(
          app.get('region').getData$(),
          data => ({ todo: data.todo })
        )
        .get$();
    })(React.createClass({
      render() {
        return <p className="widget-text">Hello World from Widget - {this.props.todo.title}</p>;
      }
    }));
    let beforeDestroyCalled = false;
    const Widget = createWidget({
      name: 'Widget',
      beforeDestroy: function () {
        beforeDestroyCalled = true;
      },
      providers: [
        { name: 'component', useValue: WidgetComponent },
        { name: 'region', useClass: RegionService },
      ],
    });

    // render
    window.app = new Core();
    render(
      window.app,
      document.getElementById('root')
    );
    expect(document.getElementById('core-text').innerHTML).to.equal('Hello World from Core');

    // register widget
    window.app.registerWidget(Widget, {
      regions: ['todo-item'],
      multi: true,
    });

    // verify multi instance widget
    const elements = _.toArray(document.getElementsByClassName('widget-text'));
    elements.forEach((el, index) => {
      expect(el.innerHTML).to.contain('Hello World from Widget - ');
      expect(el.innerHTML).to.contain(todos[index].title);
    });

    // rootApp should have the instance
    expect(window.app.getWidgetInstance('Widget', 'todo-item', 'todo-item-1')).to.not.equal(null);

    // change in props
    todos.pop(); // empty the list
    coreComponentInstance.forceUpdate();
    const updatedElements = _.toArray(document.getElementsByClassName('widget-text'));
    expect(updatedElements.length).to.equal(0);

    // check if beforeDestroy was called
    expect(beforeDestroyCalled).to.equal(true);

    // rootApp should not have the instance any more
    expect(window.app.getWidgetInstance('Widget', 'todo-item', 'todo-item-1')).to.equal(null);
  });
});
