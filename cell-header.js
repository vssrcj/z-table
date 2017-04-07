'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CellHeader = function (_Component) {
	_inherits(CellHeader, _Component);

	function CellHeader() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, CellHeader);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CellHeader.__proto__ || Object.getPrototypeOf(CellHeader)).call.apply(_ref, [this].concat(args))), _this), _this.state = { filter: undefined }, _this.componentDidUpdate = function (prevProps) {
			if (!prevProps.active && _this.props.active) {
				_this.input.focus();
			}
		}, _this.areEqual = function () {
			var _this2 = _this,
			    stateFilter = _this2.state.filter,
			    columnFilter = _this2.props.column.filter;


			return stateFilter === columnFilter || stateFilter === undefined && !columnFilter;
		}, _this.onSearch = function () {
			console.log('search');
			if (_this.areEqual()) {
				_this.props.clearActive();
			} else {
				_this.props.onSearch(_this.state.filter);
			}
		}, _this.onKeyUp = function (_ref2) {
			var keyCode = _ref2.keyCode;

			if (keyCode === 13) {
				_this.onSearch();
			}
		}, _this.onClear = function () {
			if (_this.state.filter) {
				_this.setState({ filter: undefined });
			}
			if (_this.props.column.filter) {
				_this.props.onSearch('');
			}
		}, _this.onBlur = function () {
			if (_this.areEqual()) {
				_this.props.clearActive();
			}
		}, _this.onFilterChange = function (evt) {
			_this.setState({ filter: evt.target.value });
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(CellHeader, [{
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _props = this.props,
			    active = _props.active,
			    style = _props.style,
			    column = _props.column,
			    setActive = _props.setActive,
			    sort = _props.sort,
			    onSortChange = _props.onSortChange;
			var stateFilter = this.state.filter;
			var columnFilter = column.filter,
			    columnName = column.name;


			return active ? _react2.default.createElement(
				'div',
				{ className: 'z-table--cell-header', style: style },
				_react2.default.createElement(
					'div',
					{ style: { display: 'flex', width: '100%', background: '#fff', padding: '4px' } },
					_react2.default.createElement('input', {
						className: 'z-table--head-input',
						type: 'text',
						placeholder: columnName,
						onChange: this.onFilterChange,
						style: { flex: '1', border: 'none', outline: 'none' },
						value: stateFilter === undefined ? columnFilter : stateFilter,
						ref: function ref(input) {
							_this3.input = input;
						},
						onBlur: this.onBlur,
						onKeyUp: this.onKeyUp
					}),
					_react2.default.createElement(
						'i',
						{ className: 'material-icons', onMouseDown: this.onSearch, style: { cursor: 'pointer' } },
						'search'
					),
					_react2.default.createElement(
						'i',
						{ className: 'material-icons', onMouseDown: this.onClear, style: { cursor: 'pointer' } },
						'close'
					)
				)
			) : _react2.default.createElement(
				'div',
				{ className: 'z-table--cell-header', style: style },
				column.alignRight ? _react2.default.createElement(
					'span',
					{ style: { marginLeft: 'auto' } },
					column.name
				) : _react2.default.createElement(
					'div',
					{ onClick: setActive, style: { cursor: 'pointer',
							display: 'flex', flex: '1', alignItems: 'center', fontWeight: column.filter ? 'bold' : 'inherit', color: column.filter ? '#000' : 'inherit' } },
					column.filter || column.name
				),
				_react2.default.createElement(
					'i',
					{ className: 'material-icons', onClick: onSortChange,
						style: { marginLeft: column.alignRight ? '10px' : 'auto', cursor: 'pointer', color: sort ? '#333' : '#ccc' } },
					sort && !sort.asc ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
				)
			);
		}
	}]);

	return CellHeader;
}(_react.Component);

CellHeader.propTypes = {
	setActive: _react.PropTypes.func.isRequired,
	clearActive: _react.PropTypes.func.isRequired,
	onSearch: _react.PropTypes.func.isRequired,
	style: _react.PropTypes.object.isRequired,
	active: _react.PropTypes.bool.isRequired,
	column: _react.PropTypes.object.isRequired,
	sort: _react.PropTypes.object,
	onSortChange: _react.PropTypes.func.isRequired
};
exports.default = CellHeader;