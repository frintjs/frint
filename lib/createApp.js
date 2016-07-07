'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createApp;

var _rxjs = require('rxjs');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appendAction = require('./middlewares/appendAction');

var _appendAction2 = _interopRequireDefault(_appendAction);

var _Provider = require('./components/Provider');

var _Provider2 = _interopRequireDefault(_Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseApp = function () {
  function BaseApp() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseApp);

    this.options = _extends({
      // primary info
      name: 'App',
      appId: null,
      devSessionId: null,
      rootApp: null,
      version: 1,

      // the root component to render
      component: null,

      // list of Model instances
      models: {},

      // store
      store: null,
      reducer: function reducer() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return state;
      },
      initialState: {},

      services: {},
      factories: {},

      // lifecycle callbacks
      beforeMount: function beforeMount() {},
      afterMount: function afterMount() {},
      beforeUnmount: function beforeUnmount() {}

    }, opts);

    if (!this.options.appId) {
      throw new Error('Must provide `appId` in options');
    }

    if (!this.options.component) {
      throw new Error('Must provide `component` in options');
    }

    this.widgetsByRegion = {};

    if (typeof window.app !== 'undefined') {
      this.options.rootApp = window.app;
    }

    this.widgetsSubject = new _rxjs.Subject();

    this.createStore(this.options.reducer, this.options.initialState);

    this.readableApps = [];
  }

  _createClass(BaseApp, [{
    key: 'getRootApp',
    value: function getRootApp() {
      return this.options.rootApp;
    }
  }, {
    key: 'getService',
    value: function getService(serviceName) {// eslint-disable-line
      // will be implemented below when extended
    }
  }, {
    key: 'getFactory',
    value: function getFactory(factoryName) {
      // TODO: optimize code to be more DRY
      var factories = this.getOption('factories');
      var FactoryClass = factories[factoryName];

      if (FactoryClass) {
        return new FactoryClass({
          app: this
        });
      }

      var rootApp = this.getRootApp();

      if (!rootApp) {
        return null;
      }

      var rootFactories = rootApp.getOption('factories');
      var RootFactoryClass = rootFactories[factoryName];

      if (RootFactoryClass) {
        return new RootFactoryClass({
          app: this
        });
      }

      return null;
    }
  }, {
    key: 'createStore',
    value: function createStore(rootReducer) {
      var initialState = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.options.store = (0, _redux.createStore)(rootReducer, initialState, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default.withExtraArgument({ app: this }), (0, _appendAction2.default)({
        key: 'appName',
        value: this.getOption('name')
      }), (0, _reduxLogger2.default)() // @TODO: load it in DEV environment only
      )));

      return this.options.store;
    }
  }, {
    key: 'getStore',
    value: function getStore() {
      var appName = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (!appName) {
        return this.getOption('store');
      }

      var rootApp = this.getRootApp();
      var widgetsByRegion = rootApp ? rootApp.widgetsByRegion : this.widgetsByRegion;

      var appsByName = _lodash2.default.reduce(widgetsByRegion, function (result, value) {
        value.forEach(function (app) {
          var name = app.getOption('name');
          result[name] = app;
        });

        return result;
      }, {});

      // @TODO: check for permissions
      if (typeof appsByName[appName] !== 'undefined') {
        return appsByName[appName].getStore();
      }

      return null;
    }
  }, {
    key: 'getOption',
    value: function getOption(key) {
      return this.options[key];
    }
  }, {
    key: 'registerWidget',
    value: function registerWidget(WidgetApp, regionName) {
      if (!Array.isArray(this.widgetsByRegion[regionName])) {
        this.widgetsByRegion[regionName] = [];
      }

      this.widgetsByRegion[regionName].push(WidgetApp);

      return this.widgetsSubject.next(this.widgetsByRegion);
    }
  }, {
    key: 'beforeMount',
    value: function beforeMount() {
      return this.options.beforeMount.bind(this)();
    }
  }, {
    key: 'render',
    value: function render() {
      var Component = this.getOption('component');

      var store = this.getStore();
      var self = this;

      return function () {
        return _react2.default.createElement(
          _Provider2.default,
          { app: self, store: store },
          _react2.default.createElement(Component, null)
        );
      };
    }
  }, {
    key: 'afterMount',
    value: function afterMount() {
      return this.options.afterMount.bind(this)();
    }
  }, {
    key: 'beforeUnmount',
    value: function beforeUnmount() {
      return this.options.beforeUnmount.bind(this)();
    }

    /**
     * Alternative to Core.registerWidget(),
     * by doing Widget.setRegion()
     */

  }, {
    key: 'setRegion',
    value: function setRegion(regionName) {
      var rootApp = this.getRootApp();

      if (!rootApp) {
        throw new Error('No root app instance available, so cannot set region.');
      }

      return rootApp.registerWidget(this, regionName);
    }
  }, {
    key: 'getWidgets',
    value: function getWidgets() {
      var regionName = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (!regionName) {
        return this.widgetsByRegion;
      }

      var list = this.widgetsByRegion[regionName];

      if (!list) {
        return [];
      }

      return list;
    }
  }, {
    key: 'observeWidgets',
    value: function observeWidgets() {
      return this.widgetsSubject.startWith(this.getWidgets());
    }
  }, {
    key: 'readStateFrom',
    value: function readStateFrom() {
      var appNames = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this.readableApps = appNames;
    }
  }]);

  return BaseApp;
}();

function createApp() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var modelRegistry = {};
  var serviceInstances = {};

  var App = function (_BaseApp) {
    _inherits(App, _BaseApp);

    function App() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, App);

      // models

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, _lodash2.default.merge(options, opts)));

      _lodash2.default.each(_this.options.models, function (ModelClass, modelName) {
        if (typeof ModelClass !== 'function') {
          throw new Error('Expected model class \'' + modelName + '\' to be a valid Model class');
        }

        modelRegistry[modelName] = _lodash2.default.memoize(function () {
          var attrs = _this.options.modelAttributes[modelName] || {};
          return new ModelClass(attrs);
        }, function () {
          return modelName;
        });
      });

      // services
      _lodash2.default.each(_this.options.services, function (ServiceClass, serviceName) {
        serviceInstances[serviceName] = new ServiceClass({
          app: _this
        });
      });
      return _this;
    }

    _createClass(App, [{
      key: 'getModel',
      value: function getModel(modelName) {
        if (modelName in modelRegistry) {
          return modelRegistry[modelName]();
        }
        var rootApp = this.getRootApp();
        if (rootApp) {
          return rootApp.getModel(modelName);
        }
        return null;
      }
    }, {
      key: 'getService',
      value: function getService(serviceName) {
        if (serviceInstances[serviceName]) {
          return serviceInstances[serviceName];
        }

        var rootApp = this.getRootApp();

        if (!rootApp) {
          return null;
        }

        var serviceFromRoot = rootApp.getService(serviceName);

        if (serviceFromRoot) {
          return serviceFromRoot;
        }

        return null;
      }
    }]);

    return App;
  }(BaseApp);

  return App;
}
module.exports = exports['default'];