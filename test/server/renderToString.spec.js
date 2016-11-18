/* global describe, it */
import { expect } from 'chai';
import React from 'react';

import {
  createApp,
  createComponent
} from '../../src';
import renderToString from '../../src/server/renderToString';

describe('server › renderToString', function () {
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

    const TestApp = createApp({
      appId: 'TestAppId',
      name: 'TestAppname',
      component: TestComponent,
    });

    const app = new TestApp();

    const html = renderToString(app);
    expect(html).to.contain('>Hello World!</p></div>');
  });
});
