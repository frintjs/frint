import { createApp } from 'frint';
import { createStore } from 'frint-store';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';
import { DEFAULT_COLOR } from '../constants';

export default createApp({
  name: 'BarApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent,
    },
    {
      name: 'store',
      useFactory: function ({ app }) {
        const Store = createStore({
          initialState: {
            color: {
              value: DEFAULT_COLOR,
            },
          },
          reducer: rootReducer,
        });

        return new Store();
      },
      deps: ['app'],
    }
  ],
});
