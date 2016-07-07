'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(app, node) {
  var Component = app.render();

  app.beforeMount();

  var WrapperComponent = _react2.default.createClass({
    displayName: 'WrapperComponent',
    componentDidMount: function componentDidMount() {
      app.afterMount();
    },
    componentWillUnmount: function componentWillUnmount() {
      app.beforeUnmount();
    },
    render: function render() {
      return _react2.default.createElement(Component, null);
    }
  });

  return _reactDom2.default.render(_react2.default.createElement(WrapperComponent, null), node);
}
module.exports = exports['default'];