import { IFrintProvider } from 'frint';

// Commands are registered as Frint providers, and they need to be callable.
export interface IFrintCliProvider extends IFrintProvider {
  (): any;
}
