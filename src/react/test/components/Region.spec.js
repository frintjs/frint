/* global describe, it, window, document */
import { expect } from 'chai';
import _ from 'lodash';
import ReactDOM from 'react-dom';

import { createApp } from '../../../'; // Frint with plugins applied
import h from '../../h';
import render from '../../render';
import createComponent from '../../createComponent';
import observe from '../../components/observe';
import Region from '../../components/Region';
import RegionService from '../../services/Region';
import streamProps from '../../streamProps';

describe('react › components › Region', function () {
  it('is a function', function () {
    expect(Region).to.be.a('function');
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
    const Core = createApp({
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
    const Widget1 = createApp({
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
    const Widget2 = createApp({
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
    expect(_.toArray(document.getElementsByClassName('widget2-text'))).to.equal(0);
  });
});
