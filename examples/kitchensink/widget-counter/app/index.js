import { createApp, createStore, RegionService } from 'frint';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'WidgetCounter',
  providers: [
    {
      name: 'component',
      useValue: RootComponent,
    },
    {
      name: 'store',
      useFactory(app) {
        const Store = createStore({
          initialState: {
            counter: {
              value: 0,
            }
          },
          reducer: rootReducer,
          thunkArgument: { app },
        });

        return new Store();
      },
    },
    {
      name: 'region',
      useClass: RegionService,
    }
  ],
});
