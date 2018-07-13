/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import { composeHandlers } from 'frint-component-utils';

import ReactHandler from './ReactHandler';

describe('frint-react › ReactHandler', function () {
  const component = {
    state: {
      text: ''
    },
    setState(newState, cb) {
      this.state = { ...this.state, ...newState };
      cb && cb();
    },
    props: {
      value: 'hi'
    }
  };

  it('is an object', function () {
    expect(ReactHandler).to.be.an('object');
  });

  it('gets and sets data from component', function () {
    const handler = composeHandlers(
      ReactHandler,
      {
        component
      },
    );

    handler.setData('text', 'hello');
    expect(handler.getData('text')).to.equal('hello');
    handler.setDataWithCallback('text', 'hello1', () => {});
    expect(handler.getData('text')).to.equal('hello1');
    expect(handler.getProps()).to.have.property('value', 'hi');
    expect(handler.getProp('value')).to.equal('hi');
  });
});
