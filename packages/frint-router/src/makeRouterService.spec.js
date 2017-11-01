/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import createMemoryHistory from 'history/createMemoryHistory';
import { take as take$ } from 'rxjs/operators/take';
import { last as last$ } from 'rxjs/operators/last';
import { scan as scan$ } from 'rxjs/operators/scan';

import makeRouterService from './makeRouterService';

describe('frint-router › makeRouterService', function () {
  it('is a function', function () {
    expect(makeRouterService).to.be.a('function');
  });

  it('creates a Service class', function () {
    const MemoryRouterService = makeRouterService(createMemoryHistory);

    const router = new MemoryRouterService({ foo: 'foo' });
    expect(router.options).to.contain({ foo: 'foo' });
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
        .pipe(
          take$(2),
          last$()
        )
        .subscribe(function (history) {
          expect(history.location.pathname).to.equal('/about');

          done();
        });

      router.push('/about');
    });

    it('emits location on new push', function (done) {
      const router = new MemoryRouterService();

      router.getLocation$()
        .pipe(
          take$(2),
          last$()
        )
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about');

          done();
        });

      router.push('/about');
    });

    it('matches pattern against history synchronously', function () {
      const router = new MemoryRouterService();

      // initial
      expect(router.getMatch(
        '/about',
        router.getHistory()
      )).to.equal(null);

      // after navigating to /about
      router.push('/about');
      expect(router.getMatch(
        '/about',
        router.getHistory()
      )).to.deep.equal({
        isExact: true,
        params: {},
        url: '/about',
      });

      // after navigating back to /
      router.push('/');
      expect(router.getMatch(
        '/about',
        router.getHistory()
      )).to.equal(null);
      expect(router.getLocation().pathname).to.equal('/');
    });

    it('matches pattern asynchronously', function (done) {
      const router = new MemoryRouterService();

      router.getMatch$('/about')
        .pipe(
          take$(4),
          scan$(
            (matches, currentMatch) => matches.concat([currentMatch]),
            []
          ),
          last$()
        )
        .subscribe(function (matches) {
          expect(matches).to.deep.equal([
            // on load
            null,

            // first push
            {
              url: '/about',
              isExact: true,
              params: {},
            },

            // second push
            null,

            // third push
            {
              url: '/about',
              isExact: true,
              params: {},
            },
          ]);

          done();
        });

      router.push('/about');
      router.push('/');
      router.push('/about');
    });

    it('destroys listener', function (done) {
      const router = new MemoryRouterService();

      const entries = [];

      router.getHistory$().subscribe({
        next(entry) {
          entries.push(entry);
        },
        complete() {
          expect(entries.length).to.equal(1);

          done();
        },
      });

      router.destroy();
    });

    it('goes to nth entry in history', function (done) {
      const router = new MemoryRouterService();

      router.push('/about');
      router.push('/about/hermione');
      router.go(-1);

      router.getLocation$()
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about');

          done();
        });
    });

    it('pushes history', function (done) {
      const router = new MemoryRouterService();

      router.push('/about');

      router.getLocation$()
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about');

          done();
        });
    });

    it('replaces history', function (done) {
      const router = new MemoryRouterService();

      router.replace('/about');

      router.getLocation$()
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about');

          done();
        });
    });

    it('goes back in history', function (done) {
      const router = new MemoryRouterService();

      router.push('/about');
      router.push('/about/hermione');
      router.goBack();

      router.getLocation$()
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about');

          done();
        });
    });

    it('goes forward in history', function (done) {
      const router = new MemoryRouterService();

      router.push('/about');
      router.push('/about/hermione');
      router.goBack();
      router.goForward();

      router.getLocation$()
        .subscribe(function (location) {
          expect(location.pathname).to.equal('/about/hermione');

          done();
        });
    });
  });
});
