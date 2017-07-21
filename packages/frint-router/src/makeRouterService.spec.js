/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import createMemoryHistory from 'history/createMemoryHistory';

import makeRouterService from './makeRouterService';

describe('frint-router › makeRouterService', function () {
  it('is a function', function () {
    expect(makeRouterService).to.be.a('function');
  });

  it('creates a Service class', function () {
    const MemoryRouterService = makeRouterService(createMemoryHistory);

    const router = new MemoryRouterService({ foo: 'foo' });
    expect(router.options).to.deep.equal({ foo: 'foo' });
  });

  describe('MemoryRouter', function () {
    const MemoryRouterService = makeRouterService(createMemoryHistory);

    it('emits current history on first subscribe', function (done) {
      const router = new MemoryRouterService();

      router.getHistory$().subscribe(function (history) {
        expect(history.location.pathname).to.equal('/');

        done();
      });
    });

    it('emits history on new push', function (done) {
      const router = new MemoryRouterService();

      router.getHistory$()
        .take(2)
        .last()
        .subscribe(function (history) {
          expect(history.location.pathname).to.equal('/about');

          done();
        });

      router.push('/about');
    });

    it('emits location on new push', function (done) {
      const router = new MemoryRouterService();

      router.getLocation$()
        .take(2)
        .last()
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about');

          done();
        });

      router.push('/about');
    });

    it('matches pattern against history synchronously', function () {
      const router = new MemoryRouterService();

      expect(router.getMatch(
        '/about',
        router.getHistory()
      )).to.equal(null);

      router.push('/')
      // expect(router.)
    });
  });
});
