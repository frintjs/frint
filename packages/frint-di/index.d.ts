export interface IGeneratedClass<T> {
  new (...args: any[]): T;
}

export interface IProvider {
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

export interface IContainer {
  getDeps(container: IProvider): any;
  register(container: IProvider): any;
  get<T extends IProvider>(name: string): T;
}

export interface IContainerOptions {
  containerName: string;
}

export interface IConstructor<T> {
  new(): T;
}

export function createContainer(providers: IProvider[], options: IContainerOptions): IConstructor<IContainer>;

export function resolveContainer<T>(Container: IConstructor<T>): T;
