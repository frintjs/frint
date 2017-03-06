import createApp from './createApp';

export default function createWidget(options = {}) {
  return createApp({
    ...options,
    isFrintWidget: true,
  });
}
