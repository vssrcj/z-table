'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function (_Component) {
	_inherits(Loading, _Component);

	function Loading() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, Loading);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Loading.__proto__ || Object.getPrototypeOf(Loading)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			count: 1
		}, _this.timer = function () {
			var count = _this.state.count;

			_this.setState({ count: count > 2 ? 0 : count + 1 });
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Loading, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.timer = setInterval(this.timer, 300);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			clearInterval(this.timer);
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.props.inRow) {
				return _react2.default.createElement(
					'div',
					{ style: { background: '#f7f7f7', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '8px 16px' } },
					'Loading',
					Array(this.state.count).fill().map(function (_, i) {
						return _react2.default.createElement(
							'span',
							{ key: i },
							'.'
						);
					})
				);
			}
			return _react2.default.createElement(
				'div',
				{ style: { background: '#fff', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '8px 16px' } },
				'Loading',
				Array(this.state.count).fill().map(function (_, i) {
					return _react2.default.createElement(
						'span',
						{ key: i },
						'.'
					);
				})
			);
		}
	}]);

	return Loading;
}(_react.Component);

Loading.propTypes = {
	inRow: _propTypes2.default.bool
};
Loading.defaultProps = {
	inRow: false
};
exports.default = Loading;