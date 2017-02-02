import { createApp } from 'frint';

import RootComponent from '../components/Root';

export default createApp({
  name: 'KitchensinkApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent
    },
  ],
});
