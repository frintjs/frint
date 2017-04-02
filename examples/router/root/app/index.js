import { createApp } from 'frint';
import createHistory from 'history/createBrowserHistory';
import { RouterService } from 'frint-react-router';

import RootComponent from '../components/Root';
import HomeComponent from '../components/Home';
import AboutComponent from '../components/About';

export default createApp({
  name: 'RouterApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent
    },
    {
      name: 'history',
      useFactory: () => {
        return createHistory();
      },
      cascade: true,
    },
    {
      name: 'routes',
      useValue: [
        {
          path: '/',
          component: HomeComponent,
        },
        {
          path: '/about',
          component: AboutComponent,
        }
      ],
    },
    {
      name: 'router',
      useClass: RouterService,
      deps: [
        'app',
        'history',
        'routes'
      ],
      cascade: true,
    }
  ],
});
