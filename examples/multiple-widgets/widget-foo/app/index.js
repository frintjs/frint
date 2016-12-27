import { createApp } from 'frint';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'WidgetFoo',
  component: RootComponent,
  reducer: rootReducer,
});
