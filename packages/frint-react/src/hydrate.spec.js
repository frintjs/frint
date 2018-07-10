/* eslint-disable import/no-extraneous-dependencies, func-names */
/* globals describe, document, it, beforeEach, resetDOM */
import { expect } from 'chai';
import React from 'react';
import { createApp } from 'frint';

import hydrate from './hydrate';

describe('frint-react › hydrate', function () {
  function TestComponent() {
    return <p>Hello World from TestApp!</p>;
  }

  const TestApp = createApp({
    name: 'TestApp',
    providers: [
      {
        name: 'component',
        useValue: TestComponent,
      },
    ],
  });

  beforeEach(function () {
    resetDOM();
  });

  it('hydrates app to DOM', function () {
    const app = new TestApp();
    const rootEl = document.getElementById('root');
    hydrate(app, rootEl);

    expect(rootEl.innerHTML)
      .to.contain('Hello World from TestApp!</p>');
  });
});
