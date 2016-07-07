'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mapToProps;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function mapToProps() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = _extends({
    app: function app() {},
    dispatch: {},
    factories: {},
    merge: undefined,
    options: {},
    services: {},
    shared: function shared() {},
    state: function state() {}
  }, opts);

  return function (Component) {
    var WrappedComponent = _react2.default.createClass({
      displayName: 'WrappedComponent',
      getInitialState: function getInitialState() {
        return {
          mappedAppToProps: {},
          readableStores: {},
          services: {},
          factories: {}
        };
      },
      componentWillMount: function componentWillMount() {
        var _this = this;

        this.storeSubscriptions = {};

        this.context.app.readableApps.forEach(function (readableAppName) {
          var readableAppStore = _this.context.app.getStore(readableAppName);

          _this.storeSubscriptions[readableAppName] = readableAppStore.subscribe(function () {
            var currentState = _this.state;
            var readableStores = _this.state.readableStores;

            var updatedState = _extends({}, currentState, {
              readableStores: _extends({}, readableStores, _defineProperty({}, readableAppName, readableAppStore.getState()))
            });

            _this.replaceState(updatedState);
          });
        });

        this.setState({
          mappedAppToProps: options.app(this.context.app),
          services: _lodash2.default.mapValues(options.services, function (serviceName) {
            return _this.context.app.getService(serviceName);
          }),
          factories: _lodash2.default.mapValues(options.factories, function (factoryName) {
            return _this.context.app.getFactory(factoryName);
          })
        });
      },
      componentWillUnmount: function componentWillUnmount() {
        var _this2 = this;

        Object.keys(this.storeSubscriptions).forEach(function (appName) {
          _this2.storeSubscriptions[appName]();
        });
      },
      render: function render() {
        var _this3 = this;

        var _state = this.state;
        var mappedAppToProps = _state.mappedAppToProps;
        var services = _state.services;
        var factories = _state.factories;


        var combinedMapStateToProps = function combinedMapStateToProps() {
          return _extends({}, options.state.apply(options, arguments), options.shared(_this3.state.readableStores), mappedAppToProps, services, factories);
        };

        var ConnectedComponent = (0, _reactRedux.connect)(combinedMapStateToProps, options.dispatch, options.merge, options.options)(Component);

        return _react2.default.createElement(ConnectedComponent, null);
      }
    });

    WrappedComponent.contextTypes = {
      app: _react.PropTypes.object.isRequired,
      store: _react.PropTypes.object.isRequired
    };

    return WrappedComponent;
  };
}
module.exports = exports['default'];