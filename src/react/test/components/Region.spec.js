/* global describe, it, afterEach, resetDOM, window, document */
import { expect } from 'chai';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs';
import sinon from 'sinon';

import { createCore, createWidget } from '../../../'; // Frint with plugins applied
import h from '../../h';
import render from '../../render';
import createComponent from '../../createComponent';
import observe from '../../components/observe';
import Region from '../../components/Region';
import RegionService from '../../services/Region';
import streamProps from '../../streamProps';

describe('react › components › Region', function () {
  afterEach(function () {
    resetDOM();
  });

  it('is a function', function () {
    expect(Region).to.be.a('function');
  });

  it('renders empty region when no root app available', function () {
    const MyComponent = createComponent({
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
    // core
    const CoreComponent = createComponent({
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
    const Widget1Component = createComponent({
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

    const Widget2Component = createComponent({
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
    const CoreComponent = createComponent({
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
    const CoreComponent = createComponent({
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
    const Widget1Component = createComponent({
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
    })(createComponent({
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
});
