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
        return new createStore({
          reducer: rootReducer,
          thunkArgument: { app },
        });
      },
    },
    {
      name: 'region',
      useClass: RegionService,
    }
  ],
});
