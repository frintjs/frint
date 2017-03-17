/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { Observable } from 'rxjs';

import isObservable from './isObservable';

describe('frint-react › isObservable', function () {
  it('returns true when an Observable is given', function () {
    const observable = Observable.of('foo', 'bar');

    expect(isObservable(observable)).to.equal(true);
  });

  it('returns false when something other than an Observable is given', function () {
    expect(isObservable(null)).to.equal(false);
    expect(isObservable('hello world')).to.equal(false);
    expect(isObservable(123)).to.equal(false);
    expect(isObservable(() => {})).to.equal(false);
    expect(isObservable(true)).to.equal(false);
  });
});
