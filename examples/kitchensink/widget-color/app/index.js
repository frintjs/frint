import { createWidget } from 'frint';
import { createStore } from 'frint-store';
import { RegionService } from 'frint-react';

import { DEFAULT_COLOR } from '../constants';
import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createWidget({
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
