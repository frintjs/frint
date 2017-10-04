import { Observable } from 'rxjs/Observable';

export default function addListenerMethod(context, instanceKey) {
  Object.defineProperty(context, 'listen$', {
    value(eventName) {
      return new Observable((observer) => {
        const listener = context._on(eventName, (event) => {
          observer.next({
            [instanceKey]: context,
            event,
          });
        });

        return function unsubscribe() {
          listener();
        };
      });
    },
  });
}
