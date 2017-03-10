import { createApp } from 'frint';
import { createStore } from 'frint-store';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'CounterApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent,
    },
    {
      name: 'store',
      useFactory: () => {
        const Store = createStore({
          initialState: 0,
          reducer: rootReducer,
        });
        return new Store();
      },
    },
  ]
});
