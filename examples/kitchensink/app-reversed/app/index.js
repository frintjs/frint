import { createApp } from 'frint';
import { RegionService } from 'frint-react';

import RootComponent from '../components/Root';

export default createApp({
  name: 'ReversedApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent,
    },
    {
      name: 'region',
      useClass: RegionService,
    }
  ],
});
