import App from './app';

const fooApp = new App();

fooApp.readStateFrom(['WidgetBar']);
fooApp.setRegion('main');

export default fooApp;
