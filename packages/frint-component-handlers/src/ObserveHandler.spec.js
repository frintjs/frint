/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';
import { Observable, BehaviorSubject } from 'rxjs';

import { composeHandlers, streamProps } from 'frint-component-utils';
import ObserveHandler from './ObserveHandler';

describe('frint-component-handlers › ObserveHandler', function () {
  it('is an object', function () {
    expect(ObserveHandler).to.be.an('object');
  });

  it.only('streams props from getProps$', function () {
    const app = {
      getName() {
        return 'MyAppName';
      },
    };

    const handler = composeHandlers(
      {
        _data: {},
        _parentPropsCache: {},
        setData(key, value) {
          console.log('setting', key, value);
          this._data[key] = value;
        },
        getData(key) {
          this._props$.subscribe((props) => {
            this._parentPropsCache = props;
          });

          return this._data[key];
        },
        getProps() {
          return this._parentPropsCache;
        },
      },
      ObserveHandler,
      {
        getProps$: function (a, p$) {
          const propsStream$ = Observable.merge(...[
            Observable.of({ appName: a.getName() }),
            p$.map(x => ({ propsFromParent: x }))
          ])
            .scan((props, emitted) => {
              return {
                ...props,
                ...emitted,
              };
            });

          propsStream$.subscribe(x => console.log('propsStream', x));

          return propsStream$;
        },
        app,
      },
    );

    expect(handler.getInitialData()).to.deep.equal({
      computedProps: {},
    });

    handler.initialize();
    handler.beforeMount();
    handler.afterMount();
    handler.beforeDestroy();

    expect(handler.getData('computedProps')).to.deep.equal({
      appName: 'MyAppName',
      propsFromParent: {},
    });

    handler.receiveProps({ key: 'value' });
    handler.receiveProps({ key: 'value [updated]' });

    console.log('final data', handler.getData('computedProps'));

    // expect(handler.getData('computedProps')).to.deep.equal({
    //   appName: 'MyAppName',
    //   propsFromParent: { key: 'value' },
    // });
  });

  it('handles gracefully when no getProps$ is available', function () {
    const handler = composeHandlers(
      {
        _data: {},
        getData(key) {
          return this._data[key];
        },
      },
      ObserveHandler,
      {
        app: {},
      }
    );

    handler._data = handler.getInitialData();
    handler.beforeMount();
    handler.afterMount();
    handler.beforeDestroy();

    expect(handler.getData('computedProps')).to.deep.equal({});
  });
});
