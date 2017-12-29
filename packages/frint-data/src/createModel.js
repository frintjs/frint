/* eslint-disable func-names */
import each from 'lodash/each';
import take from 'lodash/take';
import mapValues from 'lodash/mapValues';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';

import Types from './Types';
import isModel from './isModel';
import isCollection from './isCollection';
import MethodError from './errors/Method';
import BaseModel from './base/Model';
import Event from './base/Event';
import applyEventsMixin from './mixins/events';
import bubbleUpEvent from './utils/bubbleUpEvent';
import makeMethodReactive from './utils/makeMethodReactive';
import extractMethods from './utils/extractMethods';
import addListenerMethod from './utils/addListenerMethod';

export default function createModel(options = {}) {
  const {
    schema = {},
  } = options;

  const methods = extractMethods(options, [
    'schema',
    'initialize',
  ]);

  class Model extends BaseModel {
    constructor(givenAttributes = {}) {
      super(givenAttributes);
      const self = this;

      let attributes = {};

      // others listening to this model
      let eventHandlers = {};

      // this model listening to others
      const listeners = [];

      // apply mixins
      applyEventsMixin(this, eventHandlers);

      /**
       * Built-in methods
       */
      // toJS()
      Object.defineProperty(this, 'toJS', {
        value: function () {
          function convertToJS(attrs) {
            return mapValues(attrs, (v) => {
              if (
                isModel(v) ||
                isCollection(v)
              ) {
                return v.toJS();
              }

              if (isPlainObject(v)) {
                return convertToJS(v);
              }

              // for supporting Date objects
              if (
                v &&
                v instanceof Date
              ) {
                return v.toISOString();
              }

              return v;
            });
          }

          return convertToJS(attributes);
        }
      });
      makeMethodReactive(this, 'toJS');

      // destroy()
      Object.defineProperty(this, 'destroy', {
        value: function () {
          this._trigger('destroy');
          this._off();

          listeners.forEach(function (childListener) {
            if (typeof childListener === 'function') {
              childListener();
            }
          });

          each(attributes, function (v) {
            if (isModel(v) || isCollection(v)) {
              v.destroy();
            }
          });
        }
      });

      // get()
      Object.defineProperty(this, 'get', {
        value: function (path) {
          if (!path) {
            return this;
          }

          return this.getIn(path.split('.'));
        }
      });
      makeMethodReactive(this, 'get');

      // getIn()
      Object.defineProperty(this, 'getIn', {
        value: function (paths) {
          if (!isArray(paths)) {
            throw new MethodError('`path` array is not provided');
          }

          const reducedPaths = [];
          return paths.reduce((result, path) => {
            reducedPaths.push(path);

            if (!isNaN(path)) {
              // collection
              if (!isCollection(result)) {
                const collectionPath = take(reducedPaths, reducedPaths.length - 1);
                throw new MethodError(`Path ${JSON.stringify(collectionPath)} is not inside a collection`);
              }

              return result.at(path);
            }

            // model
            if (!(path in result)) {
              throw new MethodError(`Path ${JSON.stringify(reducedPaths)} does not exist`);
            }

            return result[path];
          }, this);
        }
      });
      makeMethodReactive(this, 'getIn');

      // listen$()
      addListenerMethod(this, 'model');

      // parse by schema
      const applySchema = Types.object.of(schema);
      attributes = applySchema(givenAttributes);

      // define attributes
      each(attributes, (value, attributeName) => {
        Object.defineProperty(this, attributeName, {
          get() {
            return attributes[attributeName];
          },

          set(newValue) {
            try {
              schema[attributeName](newValue);
              attributes[attributeName] = newValue;

              self._trigger('change', new Event({
                path: [attributeName]
              }));
            } catch (typesError) {
              throw typesError;
            }
          },

          enumerable: true
        });

        // watch children
        if (isModel(value) || isCollection(value)) {
          const cancelChangeWatcher = bubbleUpEvent(self, value, 'change', [attributeName]);

          const cancelDestroyListener = value._on('destroy', function () {
            self._trigger('change', new Event({
              path: [attributeName]
            }));

            cancelChangeWatcher();
          });

          listeners.push(cancelDestroyListener);
        }
      });

      // define methods
      each(methods, (func, methodName) => {
        if (
          typeof attributes[methodName] !== 'undefined' ||
          typeof this[methodName] !== 'undefined'
        ) {
          throw new MethodError(`conflicting method name: ${methodName}`);
        }

        this[methodName] = func.bind(this);
      });

      // initialize
      if (typeof options.initialize === 'function') {
        options.initialize.bind(this)();
      }
    }
  }

  return Model;
}
