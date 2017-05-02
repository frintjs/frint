import { createApp } from 'frint';
import SomeForm from '../components/SomeForm';

const SomeFormApp = createApp({
  name: "SomeFormApp",
  providers: [
    {
      name: 'component',
      useValue: SomeForm,
    }
  ]
});

export default SomeFormApp;
