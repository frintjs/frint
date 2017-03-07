/* eslint-disable import/no-extraneous-dependencies, func-names */
/* global describe, it */
import React from 'react';
import { expect } from 'chai';

import { createCore } from 'frint';

import renderToString from './renderToString';

describe('frint-react-server › renderToString', function () {
  it('is a function', function () {
    expect(renderToString).to.be.a('function');
  });

  it('returns HTML output of an App instance', function () {
    const TestComponent = React.createClass({
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
