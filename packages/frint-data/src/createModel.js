/* eslint-disable func-names */
import _ from 'lodash';

import Types from './Types';
import isModel from './isModel';
import isCollection from './isCollection';
import MethodError from './errors/Method';
import BaseModel from './base/Model';
import Event from './base/Event';
import applyEventsMixin from './mixins/events';
import bubbleUpEvent from './utils/bubbleUpEvent';
import wrapCustomMethod from './utils/wrapCustomMethod';
import makeMethodReactive from './utils/makeMethodReactive';

export default function createModel(options = {}) {
  const {
    schema = {},
    initializers = [],
  } = options;

  const methods = Object.keys(options)
    .filter(k => ['schema', 'initializers'].indexOf(k) === -1)
    .filter(k => typeof options[k] === 'function')
    .map(k => options[k]);

  class Model extends BaseModel {
    constructor(givenAttributes = {}) {
      super(givenAttributes);
      const self = this;

      let attributes = {};

      // others listening to this
      let listeners = {};

      // apply mixins
      applyEventsMixin(this, listeners); // brings in on(), off(), and trigger()

      /**
       * Built-in methods
       */
      // toJS()
      Object.defineProperty(this, 'toJS', {
        value: function () {
          function convertToJS(attrs) {
            return _.mapValues(attrs, (v) => {
              if (
                isModel(v) ||
                isCollection(v)
              ) {
                return v.toJS();
              }

              if (_.isPlainObject(v)) {
                return convertToJS(v);
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
          this.trigger('method:call', new Event({ path: ['destroy'] }));
          this.trigger('destroy');
          this.trigger('method:change', new Event({ path: ['destroy'] }));
          this.off();

          _.each(attributes, function (v) {
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
          if (!_.isArray(paths)) {
            throw new MethodError('`path` array is not provided');
          }

          const reducedPaths = [];
          return paths.reduce((result, path) => {
            reducedPaths.push(path);

            if (!isNaN(path)) {
              // collection
              if (!isCollection(result)) {
                const collectionPath = _.take(reducedPaths, reducedPaths.length - 1);
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

      // parse by schema
      const applySchema = Types.object.of(schema);
      attributes = applySchema(givenAttributes);

      // define attributes
      _.each(attributes, (value, attributeName) => {
        Object.defineProperty(this, attributeName, {
          get() {
            return attributes[attributeName];
          },

          set(newValue) {
            try {
              schema[attributeName](newValue);
              attributes[attributeName] = newValue;

              self.trigger('change', new Event({
                path: [attributeName]
              }));
            } catch (typeError) {
              throw typeError;
            }
          },

          enumerable: true
        });

        // watch children
        if (isModel(value) || isCollection(value)) {
          const changeWatcher = bubbleUpEvent(self, value, 'change', [attributeName]);
          const methodCallWatcher = bubbleUpEvent(self, value, 'method:call', [attributeName]);
          const methodChangeWatcher = bubbleUpEvent(self, value, 'method:change', [attributeName]);

          // @TODO: listener should be cleared later?
          value.on('destroy', function () {
            self.trigger('change', new Event({
              path: [attributeName]
            }));

            changeWatcher();
            methodCallWatcher();
            methodChangeWatcher();
          });
        }
      });

      // define methods
      _.each(methods, (func, methodName) => {
        if (
          typeof attributes[methodName] !== 'undefined' ||
          typeof this[methodName] !== 'undefined'
        ) {
          throw new MethodError(`conflicting method name: ${methodName}`);
        }

        this[methodName] = wrapCustomMethod(this, methodName, func);
      });

      // initializers
      initializers.forEach((initializer) => {
        initializer(this);
      });
    }
  }

  return Model;
}
