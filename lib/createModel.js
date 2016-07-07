'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createModel;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createModel() {
  var extend = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var Model = function (_BaseModel) {
    _inherits(Model, _BaseModel);

    function Model() {
      var _Object$getPrototypeO;

      _classCallCheck(this, Model);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Model)).call.apply(_Object$getPrototypeO, [this].concat(args)));

      _lodash2.default.merge(_this, extend);
      return _this;
    }

    return Model;
  }(_Model2.default);

  return Model;
}
module.exports = exports['default'];