import App from './app';

const barApp = new App();

barApp.readStateFrom(['FooApp']);
barApp.setRegion('sidebar');

export default barApp;
