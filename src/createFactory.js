// createFactory is an alias for createService
import createService from './createService';

export default function createFactory(...args) {
  console.warn('[DEPRECATED] `createFactory` has been deprecated! Use `createService` instead.'); // eslint-disable-line no-console
  return createService(...args);
}
