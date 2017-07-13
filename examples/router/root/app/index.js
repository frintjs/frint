import { createApp } from 'frint';
import HashRouterService from 'frint-router/HashRouterService';

import Root from '../components/Root';

import HomePage from '../components/HomePage';
import AboutPage from '../components/AboutPage';

import ContactApp from '../../app-contact/app';
import ServicesApp from '../../app-services/app';

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

    // static routes configuration (pre-defined)
    // (optional)
    {
      name: 'routes',
      useValue: [
        // sync component
        {
          path: '/',
          component: HomePage,
          exact: true, // matches full path
        },

        // async component
        {
          path: '/about',
          getComponent: cb => cb(null, AboutPage), // will bring its own dynamic child routes
        },

        // // sync app
        {
          path: '/contact',
          app: ContactApp,
        },

        // // async app
        {
          path: '/services',
          getApp: cb => cb(null, ServicesApp),
        },
      ]
    }
  ],
});
