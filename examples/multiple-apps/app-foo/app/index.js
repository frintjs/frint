import { createApp } from 'frint';
import { createStore } from 'frint-store';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'FooApp',
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
            counter: {
              value: 0,
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
