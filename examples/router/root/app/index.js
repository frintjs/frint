import { createApp } from 'frint';
import HashRouterService from 'frint-router/HashRouterService';

import Root from '../components/Root';

export default createApp({
  name: 'RouterApp',
  providers: [
    // root component
    {
      name: 'component',
      useValue: Root
    },

    // router service
    // (required)
    {
      name: 'router',
      useFactory: function () {
        return new HashRouterService();
      },
      cascade: true,
    },
  ],
});
