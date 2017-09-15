import Event from '../base/Event';
import isPromise from './isPromise';

export default function wrapCustomMethod(context, methodName, func) {
  return function (...args) {
    context.trigger('method:call', new Event({ path: [methodName] }));

    let changed = false;
    const watcher = context.on('change', function () {
      changed = true;
    });

    const result = func.bind(context)(...args);

    // sync
    if (!isPromise(result)) {
      watcher();

      if (changed) {
        context.trigger('method:change', new Event({
          path: [methodName]
        }));
      }

      return result;
    }

    // async
    return result.then((promiseResult) => {
      watcher();

      if (changed) {
        context.trigger('method', new Event({
          path: [methodName]
        }));
      }

      return promiseResult;
    });
  };
}
