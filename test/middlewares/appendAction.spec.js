/* global describe, it */
import { expect } from 'chai';
import appendAction from '../../src/middlewares/appendAction';

describe('middlewares › appendAction', function () {
  it('appends key/value pair to action payload', function (done) {
    const middleware = appendAction({
      key: 'customKey',
      value: 'appended value'
    });

    const action = { foo: 'bar' };

    middleware()(function (updatedAction) {
      expect(updatedAction).to.deep.equal({
        foo: 'bar',
        customKey: 'appended value'
      });

      done();
    })(action);
  });

  it('does not do anything, if no key is provided', function (done) {
    const middleware = appendAction();

    const action = { foo: 'bar' };

    middleware()(function (updatedAction) {
      expect(updatedAction).to.deep.equal({
        foo: 'bar'
      });

      done();
    })(action);
  });
});
