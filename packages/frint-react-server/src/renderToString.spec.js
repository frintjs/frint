/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it */
import React from 'react';
import { expect } from 'chai';

import { createApp } from 'frint';
import { observe, streamProps } from 'frint-react';

import renderToString from './renderToString';

describe('frint-react-server › renderToString', function () {
  it('is a function', function () {
    expect(renderToString).to.be.a('function');
  });

  it('returns HTML output of an App instance', function () {
    function TestComponent() {
      return (
        <div>
          <p>Hello World!</p>
        </div>
      );
    }

    const TestApp = createApp({
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

  it('returns HTML output of an App instance, with observed props', function () {
    function TestComponent({ name }) {
      return (
        <div>
          <p>{name}</p>
        </div>
      );
    }

    const ObservedTestComponent = observe(function (app) {
      const defaultProps = {
        name: app.getName(),
      };

      return streamProps(defaultProps)
        .get$();
    })(TestComponent);

    const TestApp = createApp({
      name: 'TestAppName',
      providers: [
        {
          name: 'component',
          useValue: ObservedTestComponent,
        },
      ],
    });

    const app = new TestApp();

    const html = renderToString(app);
    expect(html).to.contain('>TestAppName</p></div>');
  });
});
