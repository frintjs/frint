import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export class StoreOptions {
  initialState: any;
  thunkArgument: any;
  appendAction: boolean;
  reducer: (state:any) => any;
  enableLogger: boolean;
  console: (...args: any[]) => any;
}

export class Store {
  constructor(opts: StoreOptions);

  options: StoreOptions;
  internalState$: BehaviorSubject<any>;
  exposedState$: BehaviorSubject<any>;
  cachedState: any;
  subscription: Subscription;

  getState$(): BehaviorSubject<any>;

  getState(): any;

  disptach(action: string): () => Promise<any> | any;

  destroy(): void;
}

export function combineReducers(reducers: { [key: string]: (previousState: any, action: any) => any}, options?: any): (state: any, action: string) => any;
type Constructor<T extends Store> = new(...args: any[]) => T;
export function createStore<T extends Constructor<any>>(options: any): T;
