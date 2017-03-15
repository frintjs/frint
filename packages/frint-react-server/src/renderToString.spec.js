/* eslint-disable import/no-extraneous-dependencies, func-names, react/prop-types */
/* global describe, it */
import React from 'react';
import { Observable } from 'rxjs';
import { expect } from 'chai';

import { createCore } from 'frint';
import { observe } from 'frint-react';

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

  it('returns HTML output of an App instance, with observed props', function () {
    const TestComponent = React.createClass({
      render() {
        return (
          <div>
            <p>{this.props.name}</p>
          </div>
        );
      }
    });

    const ObservedTestComponent = observe(function (app) {
      return Observable.of({
        name: app.getOption('name'),
      });
    })(TestComponent);

    const TestApp = createCore({
      name: 'TestAppname',
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
