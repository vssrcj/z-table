'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cellHeader = require('./cell-header');

var _cellHeader2 = _interopRequireDefault(_cellHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ZTable = function (_Component) {
	_inherits(ZTable, _Component);

	function ZTable(props) {
		_classCallCheck(this, ZTable);

		var _this = _possibleConstructorReturn(this, (ZTable.__proto__ || Object.getPrototypeOf(ZTable)).call(this, props));

		_this.changeWrapper = function (func) {
			_this.setState({ loading: true });
			var result = func();
			_this.load(result);
			_this.setState(result);
		};

		_this.onSortChange = function (value) {
			return _this.changeWrapper(function () {
				return {
					activeSort: {
						value: value,
						asc: _this.state.activeSort.value === value ? !_this.state.activeSort.asc : true
					}
				};
			});
		};

		_this.onColumnSearch = function (value, filter) {
			return _this.changeWrapper(function () {
				_this.setActiveColumn(undefined);

				var columns = _this.state.columns.map(function (column) {
					return column.value === value ? _extends({}, column, { filter: filter }) : column;
				});

				return {
					columns: columns
				};
			});
		};

		_this.parseAll = function (result) {
			return {
				hasMore: result.hasMore,
				items: result.items.map(_this.props.parse)
			};
		};

		_this.extract = function (key, data) {
			return data[key] === undefined ? _this.state[key] : data[key];
		};

		_this.renderCell = function (column, item) {
			return column.component ? column.component(item) : item[column.value];
		};

		_this.setActiveColumn = function (activeColumn) {
			_this.setState({ activeColumn: activeColumn });
		};

		_this.renderFromPage = function () {
			var page = _this.state.page,
			    pageLength = _this.props.pageLength;

			return (page - 1) * pageLength + 1;
		};

		_this.renderToPage = function () {
			var page = _this.state.page,
			    pageLength = _this.props.pageLength;

			return page * pageLength;
		};

		_this.changePage = function (page) {
			return function () {
				return _this.changeWrapper(function () {
					return { page: page };
				});
			};
		};

		_this.renderPaging = function () {
			var _this$state = _this.state,
			    page = _this$state.page,
			    _this$state$data = _this$state.data,
			    items = _this$state$data.items,
			    hasMore = _this$state$data.hasMore,
			    pageLength = _this.props.pageLength;

			var length = items.length;

			return _react2.default.createElement(
				'div',
				{ className: 'z-table--pagination' },
				!hasMore && page === 1 ? null : _react2.default.createElement(
					'span',
					{ className: 'z-table--page ' + (page === 1 ? 'z-table--page-active' : ''), onClick: _this.changePage(1) },
					'1'
				),
				page > 3 ? _react2.default.createElement(
					'span',
					{ className: 'z-table--page--disabled' },
					'...'
				) : null,
				page > 2 ? _react2.default.createElement(
					'span',
					{ onClick: _this.changePage(page - 1), className: 'z-table--page' },
					page - 1
				) : null,
				page > 1 ? _react2.default.createElement(
					'span',
					{ className: 'z-table--page z-table--page-active' },
					page
				) : null,
				hasMore ? _react2.default.createElement(
					'span',
					{ onClick: _this.changePage(page + 1), className: 'z-table--page' },
					page + 1
				) : null,
				hasMore || parseInt(length / pageLength) > page ? _react2.default.createElement(
					'span',
					{ className: 'z-table--page--disabled' },
					'...'
				) : null
			);
		};

		_this.state = {
			data: undefined,
			activeColumn: undefined,
			activeSort: props.defaultSort,
			columns: props.columns.map(function (column) {
				return _extends({}, column, { filter: '' });
			}),
			page: 1
		};
		return _this;
	}

	_createClass(ZTable, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.load();
		}
	}, {
		key: 'load',
		value: function load() {
			var _this2 = this;

			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var callBack = arguments[1];

			var page = data.page === undefined ? 1 : data.page;
			var columns = this.extract('columns', data);
			var sort = this.extract('activeSort', data);

			var params = {};

			columns.forEach(function (column) {
				if (column.filter) {
					params[column.value] = column.filter;
				}
			});

			if (sort) {
				params['sort'] = '' + (sort.asc ? '+' : '-') + sort.value;
			}

			_axios2.default.post(this.props.url, _extends({
				'page': page || 1,
				'pageLength': this.props.pageLength
			}, params)).then(function (result) {
				_this2.setState({
					data: _this2.parseAll(result.data),
					page: page,
					loading: false
				});
				if (callBack) callBack();
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _state = this.state,
			    data = _state.data,
			    columns = _state.columns,
			    activeColumn = _state.activeColumn,
			    loading = _state.loading,
			    activeSort = _state.activeSort,
			    header = this.props.header;


			if (data === undefined) return _react2.default.createElement(
				'div',
				null,
				'Loading....'
			);

			return _react2.default.createElement(
				'div',
				{ className: 'z-table' },
				_react2.default.createElement(
					'div',
					null,
					header
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'div',
						{ className: 'z-table--head-wrapper' },
						_react2.default.createElement(
							'div',
							{ className: 'z-table--head' },
							columns.map(function (column) {
								return _react2.default.createElement(_cellHeader2.default, {
									active: column.value === activeColumn,
									sort: column.value === activeSort.value ? activeSort : undefined,
									style: { flex: column.flex },
									setActive: function setActive() {
										return _this3.setActiveColumn(column.value);
									},
									clearActive: function clearActive() {
										return _this3.setActiveColumn(undefined);
									},
									onSearch: function onSearch(filter) {
										return _this3.onColumnSearch(column.value, filter);
									},
									onSortChange: function onSortChange() {
										return _this3.onSortChange(column.value);
									},
									column: column,
									key: column.value
								});
							})
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'z-table--body', style: { overflowY: 'scroll', height: 'calc(100vh - 144px)', overflowX: 'hidden' } },
						loading ? _react2.default.createElement(
							'div',
							{ className: 'z-table--loading' },
							'Loading...'
						) : data.items.map(function (item, i) {
							return _react2.default.createElement(
								'div',
								{ className: 'z-table--row', key: i },
								columns.map(function (column) {
									return _react2.default.createElement(
										'div',
										{ key: column.value, style: { flex: column.flex, marginLeft: item.alignRight ? 'auto' : '0' } },
										column.alignRight ? _react2.default.createElement(
											'div',
											{ style: { margin: '0 20px 0 auto' } },
											_this3.renderCell(column, item)
										) : _this3.renderCell(column, item)
									);
								})
							);
						})
					),
					_react2.default.createElement(
						'div',
						{ className: 'z-table--footer' },
						'Showing ' + this.renderFromPage() + ' - ' + this.renderToPage() + ' entries',
						this.renderPaging()
					)
				)
			);
		}
	}]);

	return ZTable;
}(_react.Component);

ZTable.propTypes = {
	parse: _react.PropTypes.func,
	header: _react.PropTypes.node,
	columns: _react.PropTypes.array.isRequired,
	url: _react.PropTypes.string.isRequired,
	pageLength: _react.PropTypes.number,
	defaultSort: _react.PropTypes.object
};
ZTable.defaultProps = {
	parse: function parse(item) {
		return item;
	},
	header: null,
	pageLength: 10,
	defaultSort: {
		value: undefined,
		asc: true
	}
};
exports.default = ZTable;


var numberStyle = {
	width: '24px',
	height: '24px',
	display: 'inline-flex',
	alignItems: 'center',
	background: '#888',
	color: '#fff',
	justifyContent: 'center',
	cursor: 'pointer'
};