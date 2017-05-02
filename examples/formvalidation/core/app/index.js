import { createApp } from 'frint';
import Root from '../components/root';

export default createApp({
  name: 'FormValidationRootApp',
  providers: [
    {
      name: 'component',
      useValue: Root,
    }
  ]
});
