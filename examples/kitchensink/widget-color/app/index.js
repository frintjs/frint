import { createApp, createStore, RegionService } from 'frint';

import { DEFAULT_COLOR } from '../constants';
import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'WidgetColor',
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
            color: {
              value: DEFAULT_COLOR,
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
    }
  ],
});
