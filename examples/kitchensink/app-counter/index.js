import CounterApp from './app';

window.app.registerApp(CounterApp, {
  regions: ['main'],
  weight: 50,
});
