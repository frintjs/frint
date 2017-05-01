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

export function combineReducers(reducers: (previousState: any, action: string) => any, options:any): (state: any, action: string) => any;
export function createStore(options: any): Class<Store>;
