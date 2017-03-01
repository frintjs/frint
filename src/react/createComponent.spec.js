/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global afterEach, beforeEach, describe, it, document */
import { expect } from 'chai';
import ReactDOM from 'react-dom';

import createComponent from './createComponent';
import h from './h';

describe('react › createComponent', function () {
  it('is a function', function () {
    expect(createComponent).to.be.a('function');
  });

  it('throws error if render method is not given', function () {
    expect(() => {
      createComponent();
    }).to.throw(/missing required method: render/);
  });

  it('returns Component that can be rendered to DOM', function () {
    const MyComponent = createComponent({
      render() {
        return (
          <p id="paragraph">Hello World</p>
        );
      }
    });

    ReactDOM.render(
      <MyComponent />,
      document.getElementById('root')
    );

    const element = document.getElementById('paragraph');
    expect(element.innerHTML).to.equal('Hello World');
  });

  it('gets the DOM Node when executing getDOMElement()', function () {
    const MyComponent = createComponent({
      render() {
        return (
          <p id="paragraph">Hello World</p>
        );
      }
    });

    const instance = ReactDOM.render(
      <MyComponent />,
      document.getElementById('root')
    );

    expect(instance.getDOMElement()).to.be.equal(document.querySelector('#paragraph'));
  });

  it('fires mount callbacks', function () {
    let beforeMountCalled = false;
    let afterMountCalled = false;
    let beforeUnmountCalled = false;

    const MyComponent = createComponent({
      beforeMount() {
        beforeMountCalled = true;
      },
      afterMount() {
        afterMountCalled = true;
      },
      beforeUnmount() {
        beforeUnmountCalled = true;
      },
      render() {
        return (
          <p>Hello World</p>
        );
      }
    });

    const node = document.getElementById('root');
    ReactDOM.render(
      <MyComponent />,
      node
    );

    expect(beforeMountCalled).to.equal(true);
    expect(afterMountCalled).to.equal(true);

    ReactDOM.unmountComponentAtNode(node);
    expect(beforeUnmountCalled).to.equal(true);
  });
});
