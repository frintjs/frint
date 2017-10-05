import { createApp } from 'frint'; // eslint-disable-line import/no-extraneous-dependencies

export const ComponentHandler = {
  setData(key, value) {
    this.component.data[key] = value;
  },
  getData(key) {
    return this.component.data[key];
  },
  getProp(key) {
    return this.component.props[key];
  },
  getProps() {
    return this.component.props;
  },
  getMountableComponent(app) {
    return app.get('component');
  }
};

export function createTestApp(router, component) {
  const providers = [];

  if (router) {
    providers.push({ name: 'router', useValue: router });
  }

  if (component) {
    providers.push({ name: 'component', useValue: component });
  }

  return createApp({
    name: 'TestApp',
    providers
  });
}

export function createTestAppInstance(router, component) {
  const AppClass = createTestApp(router, component);
  return new AppClass();
}

export function createComponent() {
  return {
    data: {},
    props: {}
  };
}
