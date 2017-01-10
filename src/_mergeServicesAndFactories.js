// TODO: remove this when factories are removed
export default function mergeServicesAndFactories(options) {
  const { services = {}, factories = {} } = options;
  const collidingFactoryNames = Object.keys(factories)
    .filter(factory => factory in services && factories[factory] !== services[factory]);
  if (collidingFactoryNames.length) {
    throw new Error(`Colliding factory names: ${collidingFactoryNames.join(', ')}`);
  }

  Object.assign(services, factories);
  delete options.factories;
}
