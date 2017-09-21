/* eslint-disable func-names */
import isEvent from '../isEvent';
import Event from '../base/Event';

export default function bubbleUpEvent(context, modelOrCollection, eventName, prefix = []) {
  return modelOrCollection._on(eventName, function (event) {
    const p = typeof prefix === 'function'
      ? prefix(context, modelOrCollection)
      : prefix;

    context._trigger(eventName, new Event({
      path: isEvent(event)
        ? p.concat(event.path)
        : p
    }));
  });
}
