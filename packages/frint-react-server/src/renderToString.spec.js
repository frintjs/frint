/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it */
import React from 'react';
import { expect } from 'chai';

import { createApp } from 'frint';
import { observe, streamProps, Region } from 'frint-react';

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

  it('returns HTML output of an App instance, with childs Apps', function () {
    // root
    function RootComponent() {
      return (
        <div>
          <Region name="sidebar" />
        </div>
      );
    }
    const RootApp = createApp({
      name: 'RootApp',
      providers: [
        { name: 'component', useValue: RootComponent },
      ],
    });

    // apps
    function App1Component() {
      return <p>App 1</p>;
    }
    const App1 = createApp({
      name: 'App1',
      providers: [
        { name: 'component', useValue: App1Component },
      ],
    });

    function App2Component() {
      return <p>App 2</p>;
    }
    const App2 = createApp({
      name: 'App2',
      providers: [
        { name: 'component', useValue: App2Component },
      ],
    });

    // render
    const rootApp = new RootApp();

    // register apps
    rootApp.registerApp(App1, {
      regions: ['sidebar'],
      weight: 10,
    });

    rootApp.registerApp(App2, {
      regions: ['sidebar2'],
      weight: 10,
    });

    const string = renderToString(rootApp);

    // verify
    expect(string).to.include('>App 1</p>');
    expect(string).not.to.include('>App 2</p>');
  });
});
