export interface Provider {
  name: string;
  useValue?: any;
  useDefinedValue?: any;
  useFactory?: (...args: any[]) => any;
  useClass?: { new(...args: any[]): any; };
  deps?: any[];
  // NOTE: Providers will have extra properties which are not statically defined here.
  // This extra property is needed to make TSC less strict, and enable extra properties.
  [others: string]: any;
}

export interface Container {
  getDeps(container: Provider): any;
  register(container: Provider): any;
  get<T extends Provider>(name: string): T;
}

export interface ContainerOptions {
  containerName: string;
}

export interface Constructor<T> {
  new(): T;
}

export function createContainer(providers: Provider[], options: ContainerOptions): Constructor<Container>;

export function resolveContainer<T>(Container: Constructor<T>): T;
