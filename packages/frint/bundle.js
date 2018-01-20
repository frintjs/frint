/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __webpack_require__(1);
const rxjs_1 = __webpack_require__(3);
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { of as of$ } from 'rxjs/observable';
const operators_1 = __webpack_require__(4);
// import { concatMap as concatMap$ } from 'rxjs/operators/concatMap';
// import { find as find$ } from 'rxjs/operators/find';
// import { first as first$ } from 'rxjs/operators/first';
// import { map as map$ } from 'rxjs/operators/map';
const travix_di_1 = __webpack_require__(5);
function makeInstanceKey(region = null, regionKey = null, multi = false) {
    if (!multi ||
        (!region && !regionKey)) {
        return 'default';
    }
    let key = '';
    if (region) {
        key = region;
    }
    if (regionKey) {
        key = `${region}_${regionKey}`;
    }
    return key;
}
const defaultProviderNames = {
    component: 'component',
    container: 'container',
    store: 'store',
    app: 'app',
    parentApp: 'parentApp',
    rootApp: 'rootApp',
    region: 'region',
};
class App {
    constructor(opts) {
        this.options = Object.assign({ name: null, parentApp: null, providers: [], providerNames: defaultProviderNames, 
            // lifecycle callbacks
            // tslint:disable-next-line:no-empty
            initialize: () => { }, 
            // tslint:disable-next-line:no-empty
            beforeDestroy: () => { } }, opts);
        // errors
        if (!this.options.name) {
            throw new Error('Must provide `name` in options');
        }
        // children - create Observable if root
        this._appsCollection = [];
        this._apps$ = new rxjs_1.BehaviorSubject(this._appsCollection);
        // container
        const container = travix_di_1.createContainer([
            { name: this.options.providerNames.app, useDefinedValue: this },
            { name: this.options.providerNames.parentApp, useDefinedValue: this.getParentApp() },
            { name: this.options.providerNames.rootApp, useDefinedValue: this.getRootApp() },
        ], {
            containerName: this.options.providerNames.container,
        });
        this.container = travix_di_1.resolveContainer(container);
        // root app's providers
        this._registerRootProviders();
        // self providers
        this.options.providers.forEach((provider) => {
            this.container.register(provider);
        });
        this.options.initialize.bind(this)();
    }
    getContainer() {
        return this.container;
    }
    getRootApp() {
        const parents = this.getParentApps();
        if (parents.length === 0) {
            return this;
        }
        return parents.pop();
    }
    getParentApp() {
        return this.options[this.options.providerNames.parentApp] || null;
    }
    getParentApps() {
        function findParents(app, parents = []) {
            const parentApp = app.getParentApp();
            if (!parentApp) {
                return parents;
            }
            parents.push(parentApp);
            return findParents(parentApp, parents);
        }
        return findParents(this);
    }
    getOption(key) {
        return lodash_1.get(this.options, key);
    }
    getName() {
        return this.getOption('name');
    }
    getProviders() {
        return this.options.providers;
    }
    getProvider(name) {
        return lodash_1.find(this.options.providers, (p) => {
            return p.name === name;
        });
    }
    get(providerName) {
        const value = this.container.get(providerName);
        if (typeof value !== 'undefined') {
            return value;
        }
        return null;
    }
    getApps$(regionName = null) {
        if (!regionName) {
            return this._apps$;
        }
        return this._apps$
            .pipe(operators_1.map((collection) => {
            return collection
                .filter((w) => {
                return w.regions.indexOf(regionName) > -1;
            });
        }));
    }
    registerApp(AppClass, opts = {}) {
        const options = Object.assign({ multi: false }, opts);
        if (typeof options.name !== 'undefined') {
            Object.defineProperty(AppClass, 'frintAppName', {
                value: options.name,
                configurable: true,
            });
        }
        const existingIndex = lodash_1.findIndex(this._appsCollection, (w) => {
            return w.name === AppClass.frintAppName;
        });
        if (existingIndex !== -1) {
            throw new Error(`App '${AppClass.frintAppName}' has been already registered before.`);
        }
        this._appsCollection.push(Object.assign({}, options, { name: AppClass.frintAppName, AppClass, instances: {}, regions: options.regions || [] }));
        if (options.multi === false) {
            this.instantiateApp(AppClass.frintAppName);
        }
        this._apps$.next(this._appsCollection);
    }
    hasAppInstance(name, region = null, regionKey = null) {
        const instance = this.getAppInstance(name, region, regionKey);
        if (instance && typeof instance !== 'undefined') {
            return true;
        }
        return false;
    }
    getAppInstance(name, region = null, regionKey = null) {
        const index = lodash_1.findIndex(this._appsCollection, a => {
            return a.name === name;
        });
        if (index === -1) {
            return null;
        }
        const app = this._appsCollection[index];
        const instanceKey = makeInstanceKey(region, regionKey, app.multi);
        const instance = app.instances[instanceKey];
        if (!instance || typeof instance === 'undefined') {
            return null;
        }
        return instance;
    }
    getAppOnceAvailable$(name, region = null, regionKey = null) {
        const rootApp = this.getRootApp();
        const w = rootApp.getAppInstance(name, region, regionKey);
        if (w) {
            return rxjs_1.Observable.of(w);
        }
        return rootApp._apps$
            .pipe(operators_1.concatMap(y => y), operators_1.find(app => app.name === name), operators_1.map((x) => {
            const instanceKey = makeInstanceKey(region, regionKey, x.multi);
            return x.instances[instanceKey];
        }), operators_1.first());
    }
    instantiateApp(name, region = null, regionKey = null) {
        const index = lodash_1.findIndex(this._appsCollection, a => {
            // HACK: we should handle frintAppName differently.
            return a.AppClass.frintAppName === name;
        });
        if (index === -1) {
            throw new Error(`No app found with name '${name}'.`);
        }
        const w = this._appsCollection[index];
        const key = makeInstanceKey(region, regionKey, w.multi);
        this._appsCollection[index].instances[key] = new w.AppClass(Object.assign({}, lodash_1.omit(w, ['AppClass', 'instances']), { name: w.AppClass.frintAppName, parentApp: this }));
        return this._appsCollection[index].instances[key];
    }
    destroyApp(name, region = null, regionKey = null) {
        const index = lodash_1.findIndex(this._appsCollection, a => {
            if (!a || !a.AppClass) {
                return false;
            }
            return w.App.frintAppName === name;
        });
        if (index === -1) {
            throw new Error(`No app found with name '${name}'.`);
        }
        const w = this._appsCollection[index];
        const key = makeInstanceKey(region, regionKey, w.multi);
        if (typeof this._appsCollection[index].instances[key] === 'undefined') {
            throw new Error(`No instance with key '${key}' found for app with name '${name}'.`);
        }
        this._appsCollection[index].instances[key].beforeDestroy();
        delete this._appsCollection[index].instances[key];
    }
    beforeDestroy() {
        return this.options.beforeDestroy.bind(this)();
    }
    _registerRootProviders() {
        const parentApps = this.getParentApps();
        if (parentApps.length === 0) {
            return;
        }
        parentApps.reverse().forEach((parentApp) => {
            parentApp.getProviders().forEach((parentProvider) => {
                // do not cascade
                if (!parentProvider.cascade) {
                    return;
                }
                const definedProvider = Object.assign({}, lodash_1.omit(parentProvider, [
                    'useClass',
                    'useValue',
                    'useFactory'
                ]));
                // non-scoped
                if (!parentProvider.scoped) {
                    this.container.register(Object.assign({}, definedProvider, { useValue: parentApp.get(parentProvider.name) }));
                    return;
                }
                // scoped
                if ('useValue' in parentProvider) {
                    // `useValue` providers have no impact with scoping
                    this.container.register(Object.assign({}, definedProvider, { useValue: parentApp.get(parentProvider.name) }));
                    return;
                }
                if ('useClass' in parentProvider) {
                    this.container.register(Object.assign({}, definedProvider, { useClass: parentProvider.useClass }));
                    return;
                }
                if ('useFactory' in parentProvider) {
                    this.container.register(Object.assign({}, definedProvider, { useFactory: parentProvider.useFactory }));
                }
            });
        });
    }
}
exports.App = App;
// unregisterApp(name, region = null, regionKey = null) {
//   // @TODO
// }


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __webpack_require__(0);
const createApp_1 = __webpack_require__(10);
const Frint = {
    App: App_1.App,
    createApp: createApp_1.default,
};
exports.default = Frint;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var lib = __webpack_require__(6);

module.exports = lib;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createContainer = __webpack_require__(7);

var _createContainer2 = _interopRequireDefault(_createContainer);

var _resolveContainer = __webpack_require__(8);

var _resolveContainer2 = _interopRequireDefault(_resolveContainer);

var _createClass = __webpack_require__(9);

var _createClass2 = _interopRequireDefault(_createClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  createContainer: _createContainer2.default,
  resolveContainer: _resolveContainer2.default,
  createClass: _createClass2.default
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createContainer;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createContainer() {
  var providers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var options = _extends({
    containerName: 'container'
  }, opts);

  var Container = function () {
    function Container() {
      var _this = this;

      _classCallCheck(this, Container);

      // name ==> instance
      this.registry = {};
      Object.defineProperty(this.registry, options.containerName, {
        get: function get() {
          return _this;
        }
      });

      providers.forEach(function (provider) {
        _this.register(provider);
      });
    }

    _createClass(Container, [{
      key: 'getDeps',
      value: function getDeps(provider) {
        var _this2 = this;

        var name = provider.name;

        var depsInstances = {};

        if (Array.isArray(provider.deps)) {
          provider.deps.forEach(function (depName) {
            if (!(depName in _this2.registry)) {
              throw new Error('For provider \'' + name + '\', dependency \'' + depName + '\' is not available yet.');
            }

            depsInstances[depName] = _this2.registry[depName];
          });
        } else if (_typeof(provider.deps) === 'object') {
          Object.keys(provider.deps).forEach(function (containerDepName) {
            if (!(containerDepName in _this2.registry)) {
              throw new Error('For provider \'' + name + '\', dependency \'' + containerDepName + '\' is not available yet.');
            }

            var targetDepName = provider.deps[containerDepName];
            depsInstances[targetDepName] = _this2.registry[containerDepName];
          });
        }

        return depsInstances;
      }
    }, {
      key: 'register',
      value: function register(provider) {
        if (typeof provider.name !== 'string') {
          throw new Error('Provider has no \'name\' key.');
        }

        var name = provider.name;


        if ('useValue' in provider) {
          this.registry[name] = provider.useValue;
        } else if ('useFactory' in provider) {
          this.registry[name] = provider.useFactory(this.getDeps(provider));
        } else if ('useClass' in provider) {
          this.registry[name] = new provider.useClass(this.getDeps(provider));
        } else if ('useDefinedValue' in provider) {
          Object.defineProperty(this.registry, name, {
            get: function get() {
              return provider.useDefinedValue;
            }
          });
        } else {
          throw new Error('No value given for \'' + name + '\' provider.');
        }
      }
    }, {
      key: 'get',
      value: function get(name) {
        return this.registry[name];
      }
    }]);

    return Container;
  }();

  return Container;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveContainer;
function resolveContainer(Container) {
  return new Container();
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createClass;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createClass() {
  var extend = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var GeneratedClass = function GeneratedClass() {
    var _this = this;

    _classCallCheck(this, GeneratedClass);

    Object.keys(extend).forEach(function (key) {
      if (typeof extend[key] === 'function') {
        _this[key] = extend[key].bind(_this);
      } else {
        _this[key] = extend[key];
      }
    });

    if (typeof this.initialize === 'function') {
      this.initialize.apply(this, arguments);
    }
  };

  return GeneratedClass;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __webpack_require__(1);
const App_1 = __webpack_require__(0);
function mergeOptions(createAppOptions, constructorOptions) {
    const mergedOptions = lodash_1.merge({}, createAppOptions, constructorOptions);
    // keep lifecycle methods from both
    // `createApp(options)` and `new App(options)`
    [
        'initialize',
        'beforeDestroy',
    ].forEach((cbName) => {
        if (typeof createAppOptions[cbName] === 'function' &&
            typeof constructorOptions[cbName] === 'function') {
            mergedOptions[cbName] = function lifecycleCb() {
                createAppOptions[cbName].call(this);
                constructorOptions[cbName].call(this);
            };
        }
    });
    return mergedOptions;
}
function createApp(options) {
    class NewApp extends App_1.App {
        constructor(opts = {}) {
            super(mergeOptions(options, opts));
        }
    }
    if (typeof options.name !== 'undefined') {
        Object.defineProperty(NewApp, 'frintAppName', {
            value: options.name,
            configurable: true,
        });
    }
    return NewApp;
}
exports.default = createApp;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2EyYjc4N2E4ZTA5M2NhZGRlYTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiX1wiLFwiY29tbW9uanNcIjpcImxvZGFzaFwiLFwiY29tbW9uanMyXCI6XCJsb2Rhc2hcIixcImFtZFwiOlwibG9kYXNoXCJ9Iiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiUnhcIixcImNvbW1vbmpzXCI6XCJyeGpzXCIsXCJjb21tb25qczJcIjpcInJ4anNcIixcImFtZFwiOlwicnhqc1wifSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiUnhcIixcImNvbW1vbmpzXCI6XCJyeGpzL29wZXJhdG9yc1wiLFwiY29tbW9uanMyXCI6XCJyeGpzL29wZXJhdG9yc1wiLFwiYW1kXCI6XCJyeGpzL29wZXJhdG9yc1wifSIsIndlYnBhY2s6Ly8vQzovV29ya3NwYWNlcy9HaXRodWIvZnJpbnQvbm9kZV9tb2R1bGVzL3RyYXZpeC1kaS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vQzovV29ya3NwYWNlcy9HaXRodWIvZnJpbnQvbm9kZV9tb2R1bGVzL3RyYXZpeC1kaS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0M6L1dvcmtzcGFjZXMvR2l0aHViL2ZyaW50L25vZGVfbW9kdWxlcy90cmF2aXgtZGkvbGliL2NyZWF0ZUNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vQzovV29ya3NwYWNlcy9HaXRodWIvZnJpbnQvbm9kZV9tb2R1bGVzL3RyYXZpeC1kaS9saWIvcmVzb2x2ZUNvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vQzovV29ya3NwYWNlcy9HaXRodWIvZnJpbnQvbm9kZV9tb2R1bGVzL3RyYXZpeC1kaS9saWIvY3JlYXRlQ2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NyZWF0ZUFw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aWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2EyYjc4N2E4ZTA5M2NhZGRlYTEiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBsb2Rhc2hfMSA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbmNvbnN0IHJ4anNfMSA9IHJlcXVpcmUoXCJyeGpzXCIpO1xyXG4vLyBpbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzL0JlaGF2aW9yU3ViamVjdCc7XHJcbi8vIGltcG9ydCB7IG9mIGFzIG9mJCB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZSc7XHJcbmNvbnN0IG9wZXJhdG9yc18xID0gcmVxdWlyZShcInJ4anMvb3BlcmF0b3JzXCIpO1xyXG4vLyBpbXBvcnQgeyBjb25jYXRNYXAgYXMgY29uY2F0TWFwJCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzL2NvbmNhdE1hcCc7XHJcbi8vIGltcG9ydCB7IGZpbmQgYXMgZmluZCQgfSBmcm9tICdyeGpzL29wZXJhdG9ycy9maW5kJztcclxuLy8gaW1wb3J0IHsgZmlyc3QgYXMgZmlyc3QkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMvZmlyc3QnO1xyXG4vLyBpbXBvcnQgeyBtYXAgYXMgbWFwJCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzL21hcCc7XHJcbmNvbnN0IHRyYXZpeF9kaV8xID0gcmVxdWlyZShcInRyYXZpeC1kaVwiKTtcclxuZnVuY3Rpb24gbWFrZUluc3RhbmNlS2V5KHJlZ2lvbiA9IG51bGwsIHJlZ2lvbktleSA9IG51bGwsIG11bHRpID0gZmFsc2UpIHtcclxuICAgIGlmICghbXVsdGkgfHxcclxuICAgICAgICAoIXJlZ2lvbiAmJiAhcmVnaW9uS2V5KSkge1xyXG4gICAgICAgIHJldHVybiAnZGVmYXVsdCc7XHJcbiAgICB9XHJcbiAgICBsZXQga2V5ID0gJyc7XHJcbiAgICBpZiAocmVnaW9uKSB7XHJcbiAgICAgICAga2V5ID0gcmVnaW9uO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlZ2lvbktleSkge1xyXG4gICAgICAgIGtleSA9IGAke3JlZ2lvbn1fJHtyZWdpb25LZXl9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBrZXk7XHJcbn1cclxuY29uc3QgZGVmYXVsdFByb3ZpZGVyTmFtZXMgPSB7XHJcbiAgICBjb21wb25lbnQ6ICdjb21wb25lbnQnLFxyXG4gICAgY29udGFpbmVyOiAnY29udGFpbmVyJyxcclxuICAgIHN0b3JlOiAnc3RvcmUnLFxyXG4gICAgYXBwOiAnYXBwJyxcclxuICAgIHBhcmVudEFwcDogJ3BhcmVudEFwcCcsXHJcbiAgICByb290QXBwOiAncm9vdEFwcCcsXHJcbiAgICByZWdpb246ICdyZWdpb24nLFxyXG59O1xyXG5jbGFzcyBBcHAge1xyXG4gICAgY29uc3RydWN0b3Iob3B0cykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBuYW1lOiBudWxsLCBwYXJlbnRBcHA6IG51bGwsIHByb3ZpZGVyczogW10sIHByb3ZpZGVyTmFtZXM6IGRlZmF1bHRQcm92aWRlck5hbWVzLCBcclxuICAgICAgICAgICAgLy8gbGlmZWN5Y2xlIGNhbGxiYWNrc1xyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcclxuICAgICAgICAgICAgaW5pdGlhbGl6ZTogKCkgPT4geyB9LCBcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWVtcHR5XHJcbiAgICAgICAgICAgIGJlZm9yZURlc3Ryb3k6ICgpID0+IHsgfSB9LCBvcHRzKTtcclxuICAgICAgICAvLyBlcnJvcnNcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGBuYW1lYCBpbiBvcHRpb25zJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNoaWxkcmVuIC0gY3JlYXRlIE9ic2VydmFibGUgaWYgcm9vdFxyXG4gICAgICAgIHRoaXMuX2FwcHNDb2xsZWN0aW9uID0gW107XHJcbiAgICAgICAgdGhpcy5fYXBwcyQgPSBuZXcgcnhqc18xLkJlaGF2aW9yU3ViamVjdCh0aGlzLl9hcHBzQ29sbGVjdGlvbik7XHJcbiAgICAgICAgLy8gY29udGFpbmVyXHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdHJhdml4X2RpXzEuY3JlYXRlQ29udGFpbmVyKFtcclxuICAgICAgICAgICAgeyBuYW1lOiB0aGlzLm9wdGlvbnMucHJvdmlkZXJOYW1lcy5hcHAsIHVzZURlZmluZWRWYWx1ZTogdGhpcyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IHRoaXMub3B0aW9ucy5wcm92aWRlck5hbWVzLnBhcmVudEFwcCwgdXNlRGVmaW5lZFZhbHVlOiB0aGlzLmdldFBhcmVudEFwcCgpIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogdGhpcy5vcHRpb25zLnByb3ZpZGVyTmFtZXMucm9vdEFwcCwgdXNlRGVmaW5lZFZhbHVlOiB0aGlzLmdldFJvb3RBcHAoKSB9LFxyXG4gICAgICAgIF0sIHtcclxuICAgICAgICAgICAgY29udGFpbmVyTmFtZTogdGhpcy5vcHRpb25zLnByb3ZpZGVyTmFtZXMuY29udGFpbmVyLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gdHJhdml4X2RpXzEucmVzb2x2ZUNvbnRhaW5lcihjb250YWluZXIpO1xyXG4gICAgICAgIC8vIHJvb3QgYXBwJ3MgcHJvdmlkZXJzXHJcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJSb290UHJvdmlkZXJzKCk7XHJcbiAgICAgICAgLy8gc2VsZiBwcm92aWRlcnNcclxuICAgICAgICB0aGlzLm9wdGlvbnMucHJvdmlkZXJzLmZvckVhY2goKHByb3ZpZGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlZ2lzdGVyKHByb3ZpZGVyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbGl6ZS5iaW5kKHRoaXMpKCk7XHJcbiAgICB9XHJcbiAgICBnZXRDb250YWluZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyO1xyXG4gICAgfVxyXG4gICAgZ2V0Um9vdEFwcCgpIHtcclxuICAgICAgICBjb25zdCBwYXJlbnRzID0gdGhpcy5nZXRQYXJlbnRBcHBzKCk7XHJcbiAgICAgICAgaWYgKHBhcmVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyZW50cy5wb3AoKTtcclxuICAgIH1cclxuICAgIGdldFBhcmVudEFwcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3RoaXMub3B0aW9ucy5wcm92aWRlck5hbWVzLnBhcmVudEFwcF0gfHwgbnVsbDtcclxuICAgIH1cclxuICAgIGdldFBhcmVudEFwcHMoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZmluZFBhcmVudHMoYXBwLCBwYXJlbnRzID0gW10pIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50QXBwID0gYXBwLmdldFBhcmVudEFwcCgpO1xyXG4gICAgICAgICAgICBpZiAoIXBhcmVudEFwcCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFyZW50cy5wdXNoKHBhcmVudEFwcCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kUGFyZW50cyhwYXJlbnRBcHAsIHBhcmVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmluZFBhcmVudHModGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXRPcHRpb24oa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIGxvZGFzaF8xLmdldCh0aGlzLm9wdGlvbnMsIGtleSk7XHJcbiAgICB9XHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldE9wdGlvbignbmFtZScpO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJvdmlkZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucHJvdmlkZXJzO1xyXG4gICAgfVxyXG4gICAgZ2V0UHJvdmlkZXIobmFtZSkge1xyXG4gICAgICAgIHJldHVybiBsb2Rhc2hfMS5maW5kKHRoaXMub3B0aW9ucy5wcm92aWRlcnMsIChwKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBwLm5hbWUgPT09IG5hbWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBnZXQocHJvdmlkZXJOYW1lKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmNvbnRhaW5lci5nZXQocHJvdmlkZXJOYW1lKTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgZ2V0QXBwcyQocmVnaW9uTmFtZSA9IG51bGwpIHtcclxuICAgICAgICBpZiAoIXJlZ2lvbk5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FwcHMkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYXBwcyRcclxuICAgICAgICAgICAgLnBpcGUob3BlcmF0b3JzXzEubWFwKChjb2xsZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCh3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdy5yZWdpb25zLmluZGV4T2YocmVnaW9uTmFtZSkgPiAtMTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJBcHAoQXBwQ2xhc3MsIG9wdHMgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgbXVsdGk6IGZhbHNlIH0sIG9wdHMpO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5uYW1lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXBwQ2xhc3MsICdmcmludEFwcE5hbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogb3B0aW9ucy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbmRleCA9IGxvZGFzaF8xLmZpbmRJbmRleCh0aGlzLl9hcHBzQ29sbGVjdGlvbiwgKHcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHcubmFtZSA9PT0gQXBwQ2xhc3MuZnJpbnRBcHBOYW1lO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChleGlzdGluZ0luZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFwcCAnJHtBcHBDbGFzcy5mcmludEFwcE5hbWV9JyBoYXMgYmVlbiBhbHJlYWR5IHJlZ2lzdGVyZWQgYmVmb3JlLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hcHBzQ29sbGVjdGlvbi5wdXNoKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgbmFtZTogQXBwQ2xhc3MuZnJpbnRBcHBOYW1lLCBBcHBDbGFzcywgaW5zdGFuY2VzOiB7fSwgcmVnaW9uczogb3B0aW9ucy5yZWdpb25zIHx8IFtdIH0pKTtcclxuICAgICAgICBpZiAob3B0aW9ucy5tdWx0aSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW50aWF0ZUFwcChBcHBDbGFzcy5mcmludEFwcE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hcHBzJC5uZXh0KHRoaXMuX2FwcHNDb2xsZWN0aW9uKTtcclxuICAgIH1cclxuICAgIGhhc0FwcEluc3RhbmNlKG5hbWUsIHJlZ2lvbiA9IG51bGwsIHJlZ2lvbktleSA9IG51bGwpIHtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0QXBwSW5zdGFuY2UobmFtZSwgcmVnaW9uLCByZWdpb25LZXkpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZSAmJiB0eXBlb2YgaW5zdGFuY2UgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBnZXRBcHBJbnN0YW5jZShuYW1lLCByZWdpb24gPSBudWxsLCByZWdpb25LZXkgPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBsb2Rhc2hfMS5maW5kSW5kZXgodGhpcy5fYXBwc0NvbGxlY3Rpb24sIGEgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYS5uYW1lID09PSBuYW1lO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XTtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZUtleSA9IG1ha2VJbnN0YW5jZUtleShyZWdpb24sIHJlZ2lvbktleSwgYXBwLm11bHRpKTtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGFwcC5pbnN0YW5jZXNbaW5zdGFuY2VLZXldO1xyXG4gICAgICAgIGlmICghaW5zdGFuY2UgfHwgdHlwZW9mIGluc3RhbmNlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgZ2V0QXBwT25jZUF2YWlsYWJsZSQobmFtZSwgcmVnaW9uID0gbnVsbCwgcmVnaW9uS2V5ID0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHJvb3RBcHAgPSB0aGlzLmdldFJvb3RBcHAoKTtcclxuICAgICAgICBjb25zdCB3ID0gcm9vdEFwcC5nZXRBcHBJbnN0YW5jZShuYW1lLCByZWdpb24sIHJlZ2lvbktleSk7XHJcbiAgICAgICAgaWYgKHcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJ4anNfMS5PYnNlcnZhYmxlLm9mKHcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm9vdEFwcC5fYXBwcyRcclxuICAgICAgICAgICAgLnBpcGUob3BlcmF0b3JzXzEuY29uY2F0TWFwKHkgPT4geSksIG9wZXJhdG9yc18xLmZpbmQoYXBwID0+IGFwcC5uYW1lID09PSBuYW1lKSwgb3BlcmF0b3JzXzEubWFwKCh4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlS2V5ID0gbWFrZUluc3RhbmNlS2V5KHJlZ2lvbiwgcmVnaW9uS2V5LCB4Lm11bHRpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHguaW5zdGFuY2VzW2luc3RhbmNlS2V5XTtcclxuICAgICAgICB9KSwgb3BlcmF0b3JzXzEuZmlyc3QoKSk7XHJcbiAgICB9XHJcbiAgICBpbnN0YW50aWF0ZUFwcChuYW1lLCByZWdpb24gPSBudWxsLCByZWdpb25LZXkgPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBsb2Rhc2hfMS5maW5kSW5kZXgodGhpcy5fYXBwc0NvbGxlY3Rpb24sIGEgPT4ge1xyXG4gICAgICAgICAgICAvLyBIQUNLOiB3ZSBzaG91bGQgaGFuZGxlIGZyaW50QXBwTmFtZSBkaWZmZXJlbnRseS5cclxuICAgICAgICAgICAgcmV0dXJuIGEuQXBwQ2xhc3MuZnJpbnRBcHBOYW1lID09PSBuYW1lO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBhcHAgZm91bmQgd2l0aCBuYW1lICcke25hbWV9Jy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdyA9IHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XTtcclxuICAgICAgICBjb25zdCBrZXkgPSBtYWtlSW5zdGFuY2VLZXkocmVnaW9uLCByZWdpb25LZXksIHcubXVsdGkpO1xyXG4gICAgICAgIHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XS5pbnN0YW5jZXNba2V5XSA9IG5ldyB3LkFwcENsYXNzKE9iamVjdC5hc3NpZ24oe30sIGxvZGFzaF8xLm9taXQodywgWydBcHBDbGFzcycsICdpbnN0YW5jZXMnXSksIHsgbmFtZTogdy5BcHBDbGFzcy5mcmludEFwcE5hbWUsIHBhcmVudEFwcDogdGhpcyB9KSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XS5pbnN0YW5jZXNba2V5XTtcclxuICAgIH1cclxuICAgIGRlc3Ryb3lBcHAobmFtZSwgcmVnaW9uID0gbnVsbCwgcmVnaW9uS2V5ID0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gbG9kYXNoXzEuZmluZEluZGV4KHRoaXMuX2FwcHNDb2xsZWN0aW9uLCBhID0+IHtcclxuICAgICAgICAgICAgaWYgKCFhIHx8ICFhLkFwcENsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHcuQXBwLmZyaW50QXBwTmFtZSA9PT0gbmFtZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gYXBwIGZvdW5kIHdpdGggbmFtZSAnJHtuYW1lfScuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLl9hcHBzQ29sbGVjdGlvbltpbmRleF07XHJcbiAgICAgICAgY29uc3Qga2V5ID0gbWFrZUluc3RhbmNlS2V5KHJlZ2lvbiwgcmVnaW9uS2V5LCB3Lm11bHRpKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XS5pbnN0YW5jZXNba2V5XSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBpbnN0YW5jZSB3aXRoIGtleSAnJHtrZXl9JyBmb3VuZCBmb3IgYXBwIHdpdGggbmFtZSAnJHtuYW1lfScuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XS5pbnN0YW5jZXNba2V5XS5iZWZvcmVEZXN0cm95KCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2FwcHNDb2xsZWN0aW9uW2luZGV4XS5pbnN0YW5jZXNba2V5XTtcclxuICAgIH1cclxuICAgIGJlZm9yZURlc3Ryb3koKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5iZWZvcmVEZXN0cm95LmJpbmQodGhpcykoKTtcclxuICAgIH1cclxuICAgIF9yZWdpc3RlclJvb3RQcm92aWRlcnMoKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50QXBwcyA9IHRoaXMuZ2V0UGFyZW50QXBwcygpO1xyXG4gICAgICAgIGlmIChwYXJlbnRBcHBzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudEFwcHMucmV2ZXJzZSgpLmZvckVhY2goKHBhcmVudEFwcCkgPT4ge1xyXG4gICAgICAgICAgICBwYXJlbnRBcHAuZ2V0UHJvdmlkZXJzKCkuZm9yRWFjaCgocGFyZW50UHJvdmlkZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBjYXNjYWRlXHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudFByb3ZpZGVyLmNhc2NhZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZpbmVkUHJvdmlkZXIgPSBPYmplY3QuYXNzaWduKHt9LCBsb2Rhc2hfMS5vbWl0KHBhcmVudFByb3ZpZGVyLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgJ3VzZUNsYXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAndXNlVmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICd1c2VGYWN0b3J5J1xyXG4gICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICAgICAgLy8gbm9uLXNjb3BlZFxyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnRQcm92aWRlci5zY29wZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZWdpc3RlcihPYmplY3QuYXNzaWduKHt9LCBkZWZpbmVkUHJvdmlkZXIsIHsgdXNlVmFsdWU6IHBhcmVudEFwcC5nZXQocGFyZW50UHJvdmlkZXIubmFtZSkgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHNjb3BlZFxyXG4gICAgICAgICAgICAgICAgaWYgKCd1c2VWYWx1ZScgaW4gcGFyZW50UHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBgdXNlVmFsdWVgIHByb3ZpZGVycyBoYXZlIG5vIGltcGFjdCB3aXRoIHNjb3BpbmdcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5yZWdpc3RlcihPYmplY3QuYXNzaWduKHt9LCBkZWZpbmVkUHJvdmlkZXIsIHsgdXNlVmFsdWU6IHBhcmVudEFwcC5nZXQocGFyZW50UHJvdmlkZXIubmFtZSkgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgndXNlQ2xhc3MnIGluIHBhcmVudFByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIucmVnaXN0ZXIoT2JqZWN0LmFzc2lnbih7fSwgZGVmaW5lZFByb3ZpZGVyLCB7IHVzZUNsYXNzOiBwYXJlbnRQcm92aWRlci51c2VDbGFzcyB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCd1c2VGYWN0b3J5JyBpbiBwYXJlbnRQcm92aWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnJlZ2lzdGVyKE9iamVjdC5hc3NpZ24oe30sIGRlZmluZWRQcm92aWRlciwgeyB1c2VGYWN0b3J5OiBwYXJlbnRQcm92aWRlci51c2VGYWN0b3J5IH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5BcHAgPSBBcHA7XHJcbi8vIHVucmVnaXN0ZXJBcHAobmFtZSwgcmVnaW9uID0gbnVsbCwgcmVnaW9uS2V5ID0gbnVsbCkge1xyXG4vLyAgIC8vIEBUT0RPXHJcbi8vIH1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvQXBwLnRzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gdW5kZWZpbmVkO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcInJvb3RcIjpcIl9cIixcImNvbW1vbmpzXCI6XCJsb2Rhc2hcIixcImNvbW1vbmpzMlwiOlwibG9kYXNoXCIsXCJhbWRcIjpcImxvZGFzaFwifVxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBBcHBfMSA9IHJlcXVpcmUoXCIuL0FwcFwiKTtcclxuY29uc3QgY3JlYXRlQXBwXzEgPSByZXF1aXJlKFwiLi9jcmVhdGVBcHBcIik7XHJcbmNvbnN0IEZyaW50ID0ge1xyXG4gICAgQXBwOiBBcHBfMS5BcHAsXHJcbiAgICBjcmVhdGVBcHA6IGNyZWF0ZUFwcF8xLmRlZmF1bHQsXHJcbn07XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEZyaW50O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC50c1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHVuZGVmaW5lZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJyb290XCI6XCJSeFwiLFwiY29tbW9uanNcIjpcInJ4anNcIixcImNvbW1vbmpzMlwiOlwicnhqc1wiLFwiYW1kXCI6XCJyeGpzXCJ9XG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gdW5kZWZpbmVkO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcInJvb3RcIjpcIlJ4XCIsXCJjb21tb25qc1wiOlwicnhqcy9vcGVyYXRvcnNcIixcImNvbW1vbmpzMlwiOlwicnhqcy9vcGVyYXRvcnNcIixcImFtZFwiOlwicnhqcy9vcGVyYXRvcnNcIn1cbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGxpYiA9IHJlcXVpcmUoJy4vbGliJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbGliO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gQzovV29ya3NwYWNlcy9HaXRodWIvZnJpbnQvbm9kZV9tb2R1bGVzL3RyYXZpeC1kaS9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jcmVhdGVDb250YWluZXInKTtcblxudmFyIF9jcmVhdGVDb250YWluZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ29udGFpbmVyKTtcblxudmFyIF9yZXNvbHZlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9yZXNvbHZlQ29udGFpbmVyJyk7XG5cbnZhciBfcmVzb2x2ZUNvbnRhaW5lcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZXNvbHZlQ29udGFpbmVyKTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoJy4vY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVDb250YWluZXI6IF9jcmVhdGVDb250YWluZXIyLmRlZmF1bHQsXG4gIHJlc29sdmVDb250YWluZXI6IF9yZXNvbHZlQ29udGFpbmVyMi5kZWZhdWx0LFxuICBjcmVhdGVDbGFzczogX2NyZWF0ZUNsYXNzMi5kZWZhdWx0XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIEM6L1dvcmtzcGFjZXMvR2l0aHViL2ZyaW50L25vZGVfbW9kdWxlcy90cmF2aXgtZGkvbGliL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBjcmVhdGVDb250YWluZXI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnRhaW5lcigpIHtcbiAgdmFyIHByb3ZpZGVycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICB2YXIgb3B0aW9ucyA9IF9leHRlbmRzKHtcbiAgICBjb250YWluZXJOYW1lOiAnY29udGFpbmVyJ1xuICB9LCBvcHRzKTtcblxuICB2YXIgQ29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnRhaW5lcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb250YWluZXIpO1xuXG4gICAgICAvLyBuYW1lID09PiBpbnN0YW5jZVxuICAgICAgdGhpcy5yZWdpc3RyeSA9IHt9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMucmVnaXN0cnksIG9wdGlvbnMuY29udGFpbmVyTmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBwcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgX3RoaXMucmVnaXN0ZXIocHJvdmlkZXIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKENvbnRhaW5lciwgW3tcbiAgICAgIGtleTogJ2dldERlcHMnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldERlcHMocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIG5hbWUgPSBwcm92aWRlci5uYW1lO1xuXG4gICAgICAgIHZhciBkZXBzSW5zdGFuY2VzID0ge307XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvdmlkZXIuZGVwcykpIHtcbiAgICAgICAgICBwcm92aWRlci5kZXBzLmZvckVhY2goZnVuY3Rpb24gKGRlcE5hbWUpIHtcbiAgICAgICAgICAgIGlmICghKGRlcE5hbWUgaW4gX3RoaXMyLnJlZ2lzdHJ5KSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvciBwcm92aWRlciBcXCcnICsgbmFtZSArICdcXCcsIGRlcGVuZGVuY3kgXFwnJyArIGRlcE5hbWUgKyAnXFwnIGlzIG5vdCBhdmFpbGFibGUgeWV0LicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZXBzSW5zdGFuY2VzW2RlcE5hbWVdID0gX3RoaXMyLnJlZ2lzdHJ5W2RlcE5hbWVdO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKF90eXBlb2YocHJvdmlkZXIuZGVwcykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMocHJvdmlkZXIuZGVwcykuZm9yRWFjaChmdW5jdGlvbiAoY29udGFpbmVyRGVwTmFtZSkge1xuICAgICAgICAgICAgaWYgKCEoY29udGFpbmVyRGVwTmFtZSBpbiBfdGhpczIucmVnaXN0cnkpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm9yIHByb3ZpZGVyIFxcJycgKyBuYW1lICsgJ1xcJywgZGVwZW5kZW5jeSBcXCcnICsgY29udGFpbmVyRGVwTmFtZSArICdcXCcgaXMgbm90IGF2YWlsYWJsZSB5ZXQuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0YXJnZXREZXBOYW1lID0gcHJvdmlkZXIuZGVwc1tjb250YWluZXJEZXBOYW1lXTtcbiAgICAgICAgICAgIGRlcHNJbnN0YW5jZXNbdGFyZ2V0RGVwTmFtZV0gPSBfdGhpczIucmVnaXN0cnlbY29udGFpbmVyRGVwTmFtZV07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVwc0luc3RhbmNlcztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZWdpc3RlcicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXIocHJvdmlkZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm92aWRlci5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZXIgaGFzIG5vIFxcJ25hbWVcXCcga2V5LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5hbWUgPSBwcm92aWRlci5uYW1lO1xuXG5cbiAgICAgICAgaWYgKCd1c2VWYWx1ZScgaW4gcHJvdmlkZXIpIHtcbiAgICAgICAgICB0aGlzLnJlZ2lzdHJ5W25hbWVdID0gcHJvdmlkZXIudXNlVmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3VzZUZhY3RvcnknIGluIHByb3ZpZGVyKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RyeVtuYW1lXSA9IHByb3ZpZGVyLnVzZUZhY3RvcnkodGhpcy5nZXREZXBzKHByb3ZpZGVyKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3VzZUNsYXNzJyBpbiBwcm92aWRlcikge1xuICAgICAgICAgIHRoaXMucmVnaXN0cnlbbmFtZV0gPSBuZXcgcHJvdmlkZXIudXNlQ2xhc3ModGhpcy5nZXREZXBzKHByb3ZpZGVyKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3VzZURlZmluZWRWYWx1ZScgaW4gcHJvdmlkZXIpIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5yZWdpc3RyeSwgbmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwcm92aWRlci51c2VEZWZpbmVkVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB2YWx1ZSBnaXZlbiBmb3IgXFwnJyArIG5hbWUgKyAnXFwnIHByb3ZpZGVyLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnZ2V0JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeVtuYW1lXTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQ29udGFpbmVyO1xuICB9KCk7XG5cbiAgcmV0dXJuIENvbnRhaW5lcjtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBDOi9Xb3Jrc3BhY2VzL0dpdGh1Yi9mcmludC9ub2RlX21vZHVsZXMvdHJhdml4LWRpL2xpYi9jcmVhdGVDb250YWluZXIuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSByZXNvbHZlQ29udGFpbmVyO1xuZnVuY3Rpb24gcmVzb2x2ZUNvbnRhaW5lcihDb250YWluZXIpIHtcbiAgcmV0dXJuIG5ldyBDb250YWluZXIoKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBDOi9Xb3Jrc3BhY2VzL0dpdGh1Yi9mcmludC9ub2RlX21vZHVsZXMvdHJhdml4LWRpL2xpYi9yZXNvbHZlQ29udGFpbmVyLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZUNsYXNzO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBjcmVhdGVDbGFzcygpIHtcbiAgdmFyIGV4dGVuZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgdmFyIEdlbmVyYXRlZENsYXNzID0gZnVuY3Rpb24gR2VuZXJhdGVkQ2xhc3MoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBHZW5lcmF0ZWRDbGFzcyk7XG5cbiAgICBPYmplY3Qua2V5cyhleHRlbmQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKHR5cGVvZiBleHRlbmRba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBfdGhpc1trZXldID0gZXh0ZW5kW2tleV0uYmluZChfdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpc1trZXldID0gZXh0ZW5kW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbGl6ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBHZW5lcmF0ZWRDbGFzcztcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBDOi9Xb3Jrc3BhY2VzL0dpdGh1Yi9mcmludC9ub2RlX21vZHVsZXMvdHJhdml4LWRpL2xpYi9jcmVhdGVDbGFzcy5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBsb2Rhc2hfMSA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbmNvbnN0IEFwcF8xID0gcmVxdWlyZShcIi4vQXBwXCIpO1xyXG5mdW5jdGlvbiBtZXJnZU9wdGlvbnMoY3JlYXRlQXBwT3B0aW9ucywgY29uc3RydWN0b3JPcHRpb25zKSB7XHJcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0gbG9kYXNoXzEubWVyZ2Uoe30sIGNyZWF0ZUFwcE9wdGlvbnMsIGNvbnN0cnVjdG9yT3B0aW9ucyk7XHJcbiAgICAvLyBrZWVwIGxpZmVjeWNsZSBtZXRob2RzIGZyb20gYm90aFxyXG4gICAgLy8gYGNyZWF0ZUFwcChvcHRpb25zKWAgYW5kIGBuZXcgQXBwKG9wdGlvbnMpYFxyXG4gICAgW1xyXG4gICAgICAgICdpbml0aWFsaXplJyxcclxuICAgICAgICAnYmVmb3JlRGVzdHJveScsXHJcbiAgICBdLmZvckVhY2goKGNiTmFtZSkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgY3JlYXRlQXBwT3B0aW9uc1tjYk5hbWVdID09PSAnZnVuY3Rpb24nICYmXHJcbiAgICAgICAgICAgIHR5cGVvZiBjb25zdHJ1Y3Rvck9wdGlvbnNbY2JOYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBtZXJnZWRPcHRpb25zW2NiTmFtZV0gPSBmdW5jdGlvbiBsaWZlY3ljbGVDYigpIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUFwcE9wdGlvbnNbY2JOYW1lXS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3JPcHRpb25zW2NiTmFtZV0uY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBtZXJnZWRPcHRpb25zO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUFwcChvcHRpb25zKSB7XHJcbiAgICBjbGFzcyBOZXdBcHAgZXh0ZW5kcyBBcHBfMS5BcHAge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xyXG4gICAgICAgICAgICBzdXBlcihtZXJnZU9wdGlvbnMob3B0aW9ucywgb3B0cykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5uYW1lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOZXdBcHAsICdmcmludEFwcE5hbWUnLCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBvcHRpb25zLm5hbWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBOZXdBcHA7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlQXBwO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jcmVhdGVBcHAudHNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=