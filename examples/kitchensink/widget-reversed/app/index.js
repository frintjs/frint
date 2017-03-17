import { createWidget } from 'frint';
import { RegionService } from 'frint-react';

import RootComponent from '../components/Root';

export default createWidget({
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
