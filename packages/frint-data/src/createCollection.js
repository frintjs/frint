/* eslint-disable func-names */
import _ from 'lodash';

import MethodError from './errors/Method';
import CollectionError from './errors/Collection';
import isModel from './isModel';
import BaseCollection from './base/Collection';
import Event from './base/Event';
import applyEventsMixin from './mixins/events';
import bubbleUpEvent from './utils/bubbleUpEvent';
import makeMethodReactive from './utils/makeMethodReactive';
import extractMethods from './utils/extractMethods';

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

      // others listening to this
      let listeners = {};

      applyEventsMixin(this, listeners); // brings in on(), off(), and trigger()

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

      /**
       * Built-in methods
       */
      this.at = function (n) {
        return models[n];
      };
      makeMethodReactive(this, 'at');

      this.push = function (model) {
        if (!isModel(model)) {
          throw new CollectionError('not a valid Model instance is being pushed');
        }

        if (!(model instanceof Model)) {
          throw new CollectionError('Model instance is not of the one Collection is expecting');
        }

        const result = models.push(model);
        const index = result - 1;
        this._trigger('change', new Event({ path: [index] }));

        const changeWatcher = bubbleUp(model, 'change');

        // @TODO: these listeners should be cleared?
        model._on('destroy', () => {
          this.remove(model);
          changeWatcher();
        });

        model._on('remove', () => {
          this._trigger('change');
          changeWatcher();
        });

        return result;
      };
      makeMethodReactive(this, 'push');

      // native array methods
      [
        'every',
        'filter',
        'find',
        'forEach',
        'includes',
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
      [
        'difference',
        'findIndex',
        'first',
        'last',
        'nth',
        'take',
        'takeRight',
      ].forEach((lodashMethod) => {
        this[lodashMethod] = function (...args) {
          return _[lodashMethod](models, ...args);
        };

        makeMethodReactive(this, lodashMethod);
      });

      this.pop = function () {
        const model = models.pop();

        this._trigger('change');

        model._trigger('remove');

        return model;
      };

      this.shift = function () {
        const model = models.shift();

        this._trigger('change');

        model._trigger('remove');

        return model;
      };

      this.unshift = function (model) {
        if (!isModel(model)) {
          throw new CollectionError('not a valid Model instance is being pushed');
        }

        if (!(model instanceof Model)) {
          throw new CollectionError('Model instance is not of the one Collection is expecting');
        }

        const result = models.unshift(model);

        this._trigger('change', new Event({ path: [0] }));

        const changeWatcher = bubbleUp(model, 'change');

        // @TODO: how are these listeners cleared later?
        model._on('destroy', () => {
          this.remove(model);
          this._trigger('change');

          changeWatcher();
        });

        return result;
      };

      this.remove = function (model) {
        const index = this.findIndex(model);

        this.removeFrom(index);
      };

      this.removeFrom = function (index) {
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

      // methods
      _.each(methods, (methodFunc, methodName) => {
        if (typeof this[methodName] !== 'undefined') {
          throw new MethodError(`conflicting method name: ${methodName}`);
        }

        this[methodName] = methodFunc.bind(this);
      });

      // initialize
      givenModels.forEach((v) => {
        if (isModel(v)) {
          this.push(v);

          return;
        }

        const model = new Model(v);
        this.push(model);
      });

      if (typeof options.initialize === 'function') {
        options.initialize.bind(this)();
      }
    }
  }

  return Collection;
}
