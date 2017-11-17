/* eslint-disable func-names */
import each from 'lodash/each';
import find from 'lodash/find';
import includes from 'lodash/includes';
import findIndex from 'lodash/findIndex';
import first from 'lodash/first';
import last from 'lodash/last';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';

import MethodError from './errors/Method';
import CollectionError from './errors/Collection';
import isModel from './isModel';
import BaseCollection from './base/Collection';
import Event from './base/Event';
import applyEventsMixin from './mixins/events';
import bubbleUpEvent from './utils/bubbleUpEvent';
import makeMethodReactive from './utils/makeMethodReactive';
import extractMethods from './utils/extractMethods';
import addListenerMethod from './utils/addListenerMethod';

export default function createCollection(options = {}) {
  const Model = options.model;
  const methods = extractMethods(options, [
    'model',
    'initialize',
  ]);

  class Collection extends BaseCollection {
    constructor(givenModels = []) {
      super(givenModels);

      const models = [];

      // others listening to this collection
      let eventHandlers = {};

      // this collection listening to others
      const listeners = [];

      applyEventsMixin(this, eventHandlers);

      const bubbleUp = (model, eventName) => {
        return bubbleUpEvent(this, model, eventName, (ctx, m) => {
          return [ctx.findIndex(m)];
        });
      };

      /**
       * Built-in properties
       */
      Object.defineProperty(this, 'length', {
        get() {
          return models.length;
        }
      });

      const mutableMethods = {};

      /**
       * Built-in methods
       */
      this.get = function () {
        return this;
      };
      makeMethodReactive(this, 'get');

      this.at = function (n) {
        return models[n];
      };
      makeMethodReactive(this, 'at');

      mutableMethods.push = function (model) {
        if (!isModel(model)) {
          throw new CollectionError('not a valid Model instance is being pushed');
        }

        if (!(model instanceof Model)) {
          throw new CollectionError('Model instance is not of the one Collection is expecting');
        }

        const result = models.push(model);
        const index = result - 1;
        this._trigger('change', new Event({ path: [index] }));

        const cancelChangeWatcher = bubbleUp(model, 'change');

        const cancelRemoveListener = model._on('remove', () => {
          this._trigger('change');
          cancelChangeWatcher();
        });
        listeners.push(cancelRemoveListener);

        const cancelDestroyListener = model._on('destroy', () => {
          this.remove(model);

          cancelRemoveListener();
          cancelDestroyListener();

          cancelChangeWatcher();
        });
        listeners.push(cancelDestroyListener);

        return result;
      };
      makeMethodReactive(mutableMethods, 'push');

      // native array methods
      [
        'every',
        'filter',
        'forEach',
        'indexOf',
        'map',
        'reduce',
        'some',
      ].forEach((readOnlyMethod) => {
        this[readOnlyMethod] = function (fn, ...args) {
          return models[readOnlyMethod](fn.bind(this), ...args);
        };

        makeMethodReactive(this, readOnlyMethod);
      });

      // lodash methods
      each({
        // used from Lodash instead of native, because of IE
        find,
        includes,

        // others
        findIndex,
        first,
        last,
        take,
        takeRight,
      }, (lodashFunc, lodashFuncName) => {
        this[lodashFuncName] = function (...args) {
          return lodashFunc(models, ...args);
        };

        makeMethodReactive(this, lodashFuncName);
      });

      mutableMethods.pop = function () {
        const model = models.pop();

        this._trigger('change');

        model._trigger('remove');

        return model;
      };

      mutableMethods.shift = function () {
        const model = models.shift();

        this._trigger('change');

        model._trigger('remove');

        return model;
      };

      mutableMethods.unshift = function (model) {
        if (!isModel(model)) {
          throw new CollectionError('not a valid Model instance is being pushed');
        }

        if (!(model instanceof Model)) {
          throw new CollectionError('Model instance is not of the one Collection is expecting');
        }

        const result = models.unshift(model);

        this._trigger('change', new Event({ path: [0] }));

        const cancelChangeWatcher = bubbleUp(model, 'change');

        const cancelDestroyListener = model._on('destroy', () => {
          this.remove(model);
          this._trigger('change');

          cancelDestroyListener();
          cancelChangeWatcher();
        });
        listeners.push(cancelDestroyListener);

        return result;
      };

      mutableMethods.remove = function (model) {
        const index = this.findIndex(model);

        this.removeFrom(index);
      };

      mutableMethods.removeFrom = function (index) {
        const model = models[index];

        if (!model) {
          return;
        }

        models.splice(index, 1);
        model.destroy();
        this._trigger('change');
      };

      this.destroy = function () {
        models.forEach(function (model) {
          model.destroy();
        });

        this._trigger('destroy');
        this._off();
      };

      this.toJS = function () {
        return models.map((model) => {
          return model.toJS();
        });
      };
      makeMethodReactive(this, 'toJS');

      // listen$()
      addListenerMethod(this, 'collection');

      // combined context
      const combinedContext = {
        _on: this._on,
        _off: this._off,
        _trigger: this._trigger,
      };

      Object.keys(this).forEach((k) => {
        combinedContext[k] = this[k];
      });

      Object.keys(mutableMethods).forEach((k) => {
        combinedContext[k] = mutableMethods[k];
      });

      Object.keys(combinedContext).forEach((k) => {
        combinedContext[k] = combinedContext[k].bind(combinedContext);
      });

      // methods
      each(methods, (methodFunc, methodName) => {
        if (typeof this[methodName] !== 'undefined') {
          throw new MethodError(`conflicting method name: ${methodName}`);
        }

        this[methodName] = methodFunc.bind(combinedContext);
      });

      // initialize
      givenModels.forEach((v) => {
        if (isModel(v)) {
          combinedContext.push(v);

          return;
        }

        const model = new Model(v);
        combinedContext.push(model);
      });

      if (typeof options.initialize === 'function') {
        options.initialize.bind(combinedContext)();
      }
    }
  }

  return Collection;
}
