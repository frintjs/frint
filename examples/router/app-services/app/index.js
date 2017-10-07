import { createApp } from 'frint';

import Root from '../components/Root';

export default createApp({
  name: 'ServicesApp',

  providers: [
    {
      name: 'component',
      useValue: Root,
    },
  ]
});
