export class GeneratedClass {
  constructor(...args: any[]);
}
type Constructor<T extends GeneratedClass> = new(...args: any[]) => T;

export class Container {
  getDeps(container: Container) : any;
  register(container: Container) : any;
  get(name: string): any;
}
type ConstructorContainer<T extends Container> = new(...args: any[]) => T;

export function createClass<T extends Constructor<{}>>(...args: any[]): T;

export function createContainer<T extends Constructor<{}>>(...args: any[]): T;

export function resolveContainer<T extends ConstructorContainer<any>>(Container: T): T;
