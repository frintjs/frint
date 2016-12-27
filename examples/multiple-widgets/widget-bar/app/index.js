import { createApp } from 'frint';

import RootComponent from '../components/Root';
import rootReducer from '../reducers';

export default createApp({
  name: 'WidgetBar',
  component: RootComponent,
  reducer: rootReducer,
});
