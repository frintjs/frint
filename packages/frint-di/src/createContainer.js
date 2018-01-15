export default function createContainer(providers = [], opts = {}) {
  const options = {
    containerName: 'container',
    ...opts,
  };

  class Container {
    constructor() {
      // name ==> instance
      this.registry = {};
      Object.defineProperty(this.registry, options.containerName, {
        get: () => this
      });

      providers.forEach((provider) => {
        this.register(provider);
      });
    }

    getDeps(provider) {
      const { name } = provider;
      const depsInstances = {};

      if (Array.isArray(provider.deps)) {
        provider.deps.forEach((depName) => {
          if (!(depName in this.registry)) {
            throw new Error(`For provider '${name}', dependency '${depName}' is not available yet.`);
          }

          depsInstances[depName] = this.registry[depName];
        });
      } else if (typeof provider.deps === 'object') {
        Object.keys(provider.deps)
          .forEach((containerDepName) => {
            if (!(containerDepName in this.registry)) {
              throw new Error(`For provider '${name}', dependency '${containerDepName}' is not available yet.`);
            }

            const targetDepName = provider.deps[containerDepName];
            depsInstances[targetDepName] = this.registry[containerDepName];
          });
      }

      return depsInstances;
    }

    register(provider) {
      if (typeof provider.name !== 'string') {
        throw new Error(`Provider has no 'name' key.`);
      }

      const { name } = provider;

      if ('useValue' in provider) {
        this.registry[name] = provider.useValue;
      } else if ('useFactory' in provider) {
        this.registry[name] = provider.useFactory(this.getDeps(provider));
      } else if ('useClass' in provider) {
        this.registry[name] = new provider.useClass(this.getDeps(provider)); // eslint-disable-line
      } else if ('useDefinedValue' in provider) {
        Object.defineProperty(this.registry, name, {
          get: () => {
            return provider.useDefinedValue;
          }
        });
      } else {
        throw new Error(`No value given for '${name}' provider.`);
      }
    }

    get(name) {
      return this.registry[name];
    }
  }

  return Container;
}
