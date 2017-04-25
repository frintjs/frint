import { App } from 'frint';
import { BehaviorSubject, Observable } from 'rxjs';

export class Streamer {
  constructor(...args: any[]);

  set(value: any, ...args: any[]) : Streamer;

  setKey(key: string, value: any): Streamer;

  setPlainObject(obj: any): Streamer;

  setObservable(obj$: Observable<any>, mapper: Array<(item: any, index?: number) => void>): Streamer;

  setDispatch(actions: {[name: string]: (...args:any[]) => void}): Streamer;

  get$(): Observable<any>;
}

export class RegionService {
  constructor();

  emit() : void;

  getProps$(): BehaviorSubject<any>;

  getData$(): Observable<any>;
}

export class Provider extends React.Component {
  propTypes: React.PropTypes = {
    app: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired,
  };

  childContextTypes: React.PropTypes = {
    app: React.PropTypes.object.isRequired,
  };

  getChildContext(): { app: App };

  constructor(props: React.PropTypes, context: any);

  render() : React.ReactElement<any>;
}

export function streamProps(...args: any[]): Streamer;
export function isObservable(obj: any): boolean;
export function render(app: App, node: Element): void | Element | React.Component<any, React.ComponentState>;
export function getMountableComponent(app: App): () => React.Component | Element;
export function observe(fn: (app: App) => Observable<any>): () => React.Component | Element;
