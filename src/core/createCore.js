import createApp from './createApp';

export default function createCore(options = {}) {
  return createApp({
    ...options,
    isFrintCore: true,
  });
}
