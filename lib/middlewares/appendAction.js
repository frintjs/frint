"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var opts = _extends({
    key: null,
    value: null
  }, options);

  return function (store) {
    return function (next) {
      return function (action) {
        // eslint-disable-line
        if (!opts.key) {
          return next(action);
        }

        return next(_extends({}, action, _defineProperty({}, opts.key, opts.value)));
      };
    };
  };
};

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = exports['default'];