import App from './app';

const barApp = new App();

barApp.readStateFrom(['WidgetFoo']);
barApp.setRegion('sidebar');

export default barApp;
