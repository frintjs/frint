import { createApp } from 'frint';

import Root from '../components/Root';

export default createApp({
  name: 'ContactApp',

  providers: [
    {
      name: 'component',
      useValue: Root,
    },
  ]
});
