import { createApp } from 'frint';
import HashRouterService from 'frint-router/HashRouterService';

import Root from '../components/Root';

import HomePage from '../components/HomePage';
import AboutPage from '../components/AboutPage';

// import MessagesApp from '../../app-messages/app';
// import TodosApp from '../../app-todos/app';

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
        // {
        //   path: '/messages',
        //   App: MessagesApp, // will bring its own dynamic child routes
        // },

        // // async app
        // {
        //   path: '/todos',
        //   getApp: cb => cb(null, TodosApp), // will brings own own dynamic child routes
        // },
      ]
    }
  ],
});
