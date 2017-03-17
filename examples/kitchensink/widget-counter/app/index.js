import { createWidget } from 'frint';
import { createStore } from 'frint-store';
import { RegionService } from 'frint-react';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createWidget({
  name: 'WidgetCounter',
  providers: [
    {
      name: 'component',
      useValue: RootComponent,
    },
    {
      name: 'store',
      useFactory: ({ app }) => {
        const Store = createStore({
          initialState: {
            counter: {
              value: 5,
            }
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
    }
  ],
});
