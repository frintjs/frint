import _ from 'lodash';
import { createWidget } from 'frint';
import { createStore } from 'frint-store';
import { RegionService } from 'frint-react';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createWidget({
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
