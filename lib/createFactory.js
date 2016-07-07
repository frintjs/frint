'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFactory;

var _createService = require('./createService');

var _createService2 = _interopRequireDefault(_createService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // creation of Service and Factory classes are same as of this point


function createFactory() {
  var extend = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var Service = (0, _createService2.default)(extend);

  var Factory = function (_Service) {
    _inherits(Factory, _Service);

    function Factory() {
      _classCallCheck(this, Factory);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Factory).apply(this, arguments));
    }

    return Factory;
  }(Service);

  return Factory;
}
module.exports = exports['default'];