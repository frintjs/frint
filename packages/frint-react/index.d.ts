import { App } from "frint";
import * as React from "react";
import { BehaviorSubject, Observable } from "rxjs";

export class Streamer {
  constructor(...args: any[]);

  set(value: any, ...args: any[]): Streamer;

  setKey(key: string, value: any): Streamer;

  setPlainObject(obj: any): Streamer;

  setObservable(obj$: Observable<any>, mapper: Array<(item: any, index?: number) => void>): Streamer;

  setDispatch(actions: {[name: string]: (...args: any[]) => any}, dispatcher: any): Streamer;

  get$(): Observable<any>;
}

export interface RegionProps {
  name: string;
  uniqueKey?: string;
  data?: any;
}

export class Region extends React.Component<RegionProps, any> {
  constructor(...args: any[]);

  shouldComponentUpdate(): boolean;
  
  componentWillMount(): any;
  UNSAFE_componentWillMount(): any;

  componentWillReceiveProps(): any;
  UNSAFE_componentWillReceiveProps(): any;

  componentWillUnmount(): any;

  render(): React.ReactElement<React.Component>;
}

export class RegionService {
  constructor();

  emit() : void;

  getProps$(): BehaviorSubject<any>;

  getData$(): Observable<any>;
}

export interface ProviderProps {
  app: App;
  children: any;
}

export interface ProviderChildContextTypes {
  app: App;
}

export class Provider extends React.Component<ProviderProps, any> {
  static childContextTypes: ProviderChildContextTypes;

  getChildContext(): { app: App };

  render(): React.ReactElement<any>;
}

export function streamProps(...args: any[]): Streamer;
export function isObservable(obj: any): boolean;
export function render(app: App, node: Element): void | Element | React.Component<any, React.ComponentState>;
export function getMountableComponent(app: App): React.SFC;
type Constructor<T extends React.Component<any, any>> = new(...args: any[]) => T;
export function observe<T extends Constructor<React.Component<any, any>>>(fn: (app: App) => Observable<any>): (comp: T) => any;
