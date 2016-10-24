'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _subscribes = require('../decorators/pubsub/subscribes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class TopicSubscriber
 * @memberof Simpl.components
 */
var TopicSubscriber = function (_React$Component) {
  _inherits(TopicSubscriber, _React$Component);

  function TopicSubscriber() {
    _classCallCheck(this, TopicSubscriber);

    return _possibleConstructorReturn(this, (TopicSubscriber.__proto__ || Object.getPrototypeOf(TopicSubscriber)).apply(this, arguments));
  }

  _createClass(TopicSubscriber, [{
    key: 'render',
    value: function render() {
      // eslint-disable-next-line react/prop-types
      var Child = _react2.default.Children.only(this.props.children).type;
      var SubscribedChild = (0, _subscribes.subscribes)(Child, this.props.topic, this.props.options);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(SubscribedChild, _extends({}, this.props, this.state))
      );
    }
  }]);

  return TopicSubscriber;
}(_react2.default.Component);

TopicSubscriber.propTypes = {
  topic: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func]).isRequired,
  options: _react2.default.PropTypes.object
};

exports.default = TopicSubscriber;