/* eslint-disable import/no-extraneous-dependencies, func-names, react/react-in-jsx-scope */
/* globals describe, document, it, sinon, expect */
import React from 'react';
import { createApp } from 'frint';
import {
  getMountableComponent,
  RegionService,
} from 'frint-react';
import { createStore } from 'frint-store';
import { mount } from 'enzyme';

import Root from '../../components/Root';
import rootReducer from '../../reducers';

describe('app-counter -> root component', function () {
  it('render', function () {
    const foo = {
      getAppName: () => 'foo',
    };

    const bar = {
      getAppName: () => 'bar',
    };

    const spyFoo = sinon.spy(foo, 'getAppName');
    const spyBar = sinon.spy(bar, 'getAppName');

    const App = createApp({
      name: 'MyApp',
      providers: [
        {
          name: 'component',
          useValue: Root,
        },
        {
          name: 'foo',
          useValue: foo,
        },
        {
          name: 'bar',
          useValue: bar,
          cascade: true,
          scoped: true,
        },
        {
          name: 'baz',
          useValue: 'baz',
          cascade: false, // will not be shared with children at all
        },
        {
          name: 'store',
          useFactory: ({ app }) => {
            const Store = createStore({
              initialState: {
                counter: {
                  value: 5,
                },
                color: {
                  value: '#000000',
                },
              },
              reducer: rootReducer,
              thunkArgument: { app },
            });
            return new Store();
          },
          deps: ['app'],
        },
        {
          name: 'region',
          useClass: RegionService,
        },
      ],
    });

    const Component = getMountableComponent(new App());

    const comp = mount(<Component />);
    expect(comp.contains(<strong>Services:</strong>)).to.equal(true);
    expect(spyFoo.calledOnce).to.equal(true);
    expect(spyBar.calledOnce).to.equal(true);
  });
});

