'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO: check for an alternative to remove global dependency
function getWidgets(name) {
  return window.app.getWidgets(name);
} /* eslint-disable no-console */


function getObservable(name) {
  return window.app.observeWidgets(name);
}

function isRootAppAvailable() {
  return window.app;
}

exports.default = _react2.default.createClass({
  displayName: 'Region',

  propTypes: {
    name: _react.PropTypes.string.isRequired
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    var observable = getObservable();

    this.subscription = observable.subscribe({
      // @TODO: this can be optimized further
      next: function next() {
        _this.setState({
          list: getWidgets(_this.props.name)
        });

        _this.state.list.forEach(function (widget) {
          if (!isRootAppAvailable()) {
            return;
          }

          var widgetName = widget.getOption('name');

          // @TODO: later re-implement this check with observables
          var rootApp = widget.getRootApp();
          var areDependenciesLoaded = widget.readableApps.length > 0 ? widget.readableApps.every(function (readableApp) {
            return rootApp.getStore(readableApp);
          }) : true;

          if (!areDependenciesLoaded) {
            return;
          }

          var existsInState = _this.state.listForRendering.some(function (item) {
            return item.name === widgetName;
          });

          if (existsInState) {
            return;
          }

          var WidgetComponent = widget.render();
          var WrapperComponent = _react2.default.createClass({
            displayName: 'WrapperComponent',
            componentWillMount: function componentWillMount() {
              widget.beforeMount();
            },
            componentDidMount: function componentDidMount() {
              widget.afterMount();
            },
            componentWillUnmount: function componentWillUnmount() {
              widget.beforeUnmount();
            },
            render: function render() {
              return _react2.default.createElement(WidgetComponent, null);
            }
          });

          var listForRendering = _this.state.listForRendering;

          listForRendering.push({
            name: widgetName,
            Component: WrapperComponent
          });

          _this.setState({ listForRendering: listForRendering });
        });
      },
      error: function error(err) {
        console.warn('Subscription error for <Region name="' + _this.props.name + '" />:', err);
      }
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    this.subscription.unsubscribe();
  },
  getInitialState: function getInitialState() {
    return {
      list: [], // array of widgetApps
      listForRendering: [] // array of {name, component} objects
    };
  },
  render: function render() {
    var listForRendering = this.state.listForRendering;


    if (listForRendering.length === 0) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      null,
      listForRendering.map(function (item) {
        var Component = item.Component;
        var name = item.name;


        return _react2.default.createElement(Component, { key: name });
      })
    );
  }
});
module.exports = exports['default'];