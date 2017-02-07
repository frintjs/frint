import { createApp, RegionService } from 'frint';

import RootComponent from '../components/Root';

export default createApp({
  name: 'WidgetReversed',
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
