/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import { expect } from 'chai';

import Frint from '../frint';
import CorePlugin from '../core';
import ReactPlugin from '../react';
import ReactServerPlugin from '../';

// @TODO: figure a way out to not pollute global reference in CommonJS
Frint.use(CorePlugin);
Frint.use(ReactPlugin);
Frint.use(ReactServerPlugin);

const {
  createCore,
  createComponent,
  h,
  renderToString,
} = Frint;

describe('react-server › renderToString', function () {
  it('is a function', function () {
    expect(renderToString).to.be.a('function');
  });

  it('returns HTML output of an App instance', function () {
    const TestComponent = createComponent({
      render() {
        return (
          <div>
            <p>Hello World!</p>
          </div>
        );
      }
    });

    const TestApp = createCore({
      name: 'TestAppname',
      providers: [
        {
          name: 'component',
          useValue: TestComponent,
        },
      ],
    });

    const app = new TestApp();

    const html = renderToString(app);
    expect(html).to.contain('>Hello World!</p></div>');
  });
});
