import { FrintProvider } from 'frint';

// Commands are registered as Frint providers, and they need to be callable.
export interface FrintCliProvider extends FrintProvider {
  (): any;
}
