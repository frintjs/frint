'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createService;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createService() {
  var extend = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var Service = function Service() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Service);

    if (!options.app) {
      throw new Error('App instance not provided.');
    }

    this.app = options.app;

    _lodash2.default.merge(this, extend);

    Object.keys(this).filter(function (prop) {
      return _this[prop] instanceof Function;
    }).forEach(function (prop) {
      return _this[prop] = _this[prop].bind(_this);
    });

    if (typeof this.initialize === 'function') {
      this.initialize();
    }
  };

  return Service;
}
module.exports = exports['default'];