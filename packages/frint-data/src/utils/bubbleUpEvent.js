import isEvent from '../isEvent';
import Event from '../base/Event';

export default function bubbleUpEvent(context, mc, eventName, prefix = []) {
  return mc.on(eventName, function (event) {
    const p = typeof prefix === 'function'
      ? prefix(context, mc)
      : prefix;

    context.trigger(eventName, new Event({
      path: isEvent(event)
        ? p.concat(event.path)
        : p
    }));
  });
}
