import _ from 'lodash';
import { createApp, createStore, RegionService } from 'frint';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'WidgetTodos',
  providers: [
    {
      name: 'component',
      useValue: RootComponent,
    },
    {
      name: 'store',
      useFactory({ app }) {
        const Store = createStore({
          initialState: {
            todos: {
              records: [
                {
                  id: _.uniqueId(),
                  title: 'First todo',
                },
                {
                  id: _.uniqueId(),
                  title: 'Second todo',
                },
              ]
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
