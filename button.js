'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = function Button(_ref) {
	var children = _ref.children;
	return _react2.default.createElement(
		'button',
		{ className: 'z-table--button' },
		children
	);
};

Button.propTypes = {
	children: _react.PropTypes.node.isRequired,
	color: _react.PropTypes.string
};

Button.defaultProps = {
	color: '#bbb'
};

exports.default = Button;