import App from './app';

const fooApp = new App();

fooApp.readStateFrom(['BarApp']);
fooApp.setRegion('main');

export default fooApp;
