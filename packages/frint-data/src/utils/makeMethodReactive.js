/* eslint-disable func-names */
import { Observable } from 'rxjs/Observable';

export default function makeMethodReactive(context, method) {
  Object.defineProperty(context, `${method}$`, {
    value(...args) {
      return new Observable(function (observer) {
        observer.next(context[method](...args));

        const listener = context._on('change', function () {
          observer.next(context[method](...args));
        });

        return function () {
          listener();
        };
      });
    }
  });
}
