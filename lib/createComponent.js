'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module that specifies the createComponent function for creating Components.
 *
 * @module src/createComponent.js
 */

/**
 * Creates a component to be used in the application.
 *
 * @function createComponent
 * @param {Object} options Specify the options to be used in this component,
 * the supported members are the render method, and lifecycle event handlers.
 * @return {ReactClass} The created component object.
 * @public
 */
function createComponent() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return _react2.default.createClass(_extends({}, options, {
    componentDidMount: function componentDidMount() {
      if (typeof options.afterMount === 'function') {
        return options.afterMount.call(this);
      }

      return null;
    },
    componentWillUnmount: function componentWillUnmount() {
      if (typeof options.beforeUnmount === 'function') {
        return options.beforeUnmount.call(this);
      }

      return null;
    }
  }));
}
module.exports = exports['default'];