import { createApp } from 'frint';

import RootComponent from '../components/Root';
import Foo from '../services/Foo';
import Bar from '../services/Bar';
import Baz from '../services/Baz';

export default createApp({
  name: 'KitchensinkApp',
  providers: [
    {
      name: 'component',
      useValue: RootComponent
    },
    {
      name: 'foo',
      useClass: Foo,
      cascade: true, // the same instance will be shared with children
      deps: ['app'],
    },
    {
      name: 'bar',
      useClass: Bar,
      cascade: true,
      scoped: true, // the same class, will be shared with children, but with fresh new instance scoped by Child
      deps: ['app'],
    },
    {
      name: 'baz',
      useClass: Baz,
      cascade: false, // will not be shared with children at all
      deps: ['app'],
    },
  ],
});
