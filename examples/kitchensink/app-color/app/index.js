import { createApp } from 'frint';
import { RegionService } from 'frint-react';
import { createStore } from 'frint-store';

import { DEFAULT_COLOR } from '../constants';
import RootComponent from '../components/Root';
import rootReducer from '../reducers';
import colorEpic$ from '../epics';

export default createApp({
  name: 'ColorApp',
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
          epic: colorEpic$,
          deps: { app },
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
