/* global describe, it */
import { expect } from 'chai';
import { PropTypes } from '../src';

describe('PropTypes', () => {
  it('checks for existence of various types', () => {
    expect(PropTypes.string).to.be.a('function');
    expect(PropTypes.string.isRequired).to.be.a('function');

    expect(PropTypes.node).to.be.a('function');
    expect(PropTypes.node.isRequired).to.be.a('function');

    expect(PropTypes.number).to.be.a('function');
    expect(PropTypes.number.isRequired).to.be.a('function');

    expect(PropTypes.object).to.be.a('function');
    expect(PropTypes.object.isRequired).to.be.a('function');

    expect(PropTypes.bool).to.be.a('function');
    expect(PropTypes.bool.isRequired).to.be.a('function');

    expect(PropTypes.func).to.be.a('function');
    expect(PropTypes.func.isRequired).to.be.a('function');
  });
});
