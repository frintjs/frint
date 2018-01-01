import { createApp } from 'frint';
import providers from './providers.mock';

export default function createMockedRootApp(options?: any) {
  const overrideProviders = (options && options.providers) || [];

  return createApp({
    name: 'FrintCLI Mocked',

    providers: overrideProviders.reduce((acc, provider) => {
      const index = providers.findIndex(item => item.name === provider.name);

      if (index > -1) {
        acc[index] = provider;
      }

      return acc;
    }, providers)
  });
}
