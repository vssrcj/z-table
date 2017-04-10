'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
function recur(obj, keys, i) {
	if (obj === null) return '';
	var val = obj[keys[i]];
	if (val === undefined) return '';
	if (keys.length === i + 1) return val;
	return recur(val, keys, i + 1);
}
var getValue = exports.getValue = function getValue(obj, key) {
	var keys = key.split('.');
	return recur(obj, keys, 0);
};

/*
 * downloads table in a spreadsheet format
 */
var exportTable = exports.exportTable = function exportTable(items, columns, name) {

	// const renderColumns = columns.filter(x => x.key != undefined);
	var header = columns.map(function (column) {
		return '  <ss:Cell>\n' + '    <ss:Data ss:Type=\'String\'>' + column.name + '</ss:Data>\n' + '  </ss:Cell>\n';
	}).join('');

	var body = items.map(function (item) {
		return '<ss:Row>\n' + columns.map(function (_ref) {
			var value = _ref.value,
			    parse = _ref.parse,
			    render = _ref.render;

			var val = render ? render(item) : getValue(item, value);
			if (parse) val = parse(val);
			return '  <ss:Cell>\n' + ('    <ss:Data ss:Type="' + (typeof val === 'number' ? 'Number' : 'String') + '">') + val + '</ss:Data>\n' + '  </ss:Cell>\n';
		}).join('') + '</ss:Row>\n';
	}).join('');

	var table = '<?xml version="1.0"?>\n' + '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' + '<ss:Worksheet ss:Name="Sheet1">\n' + '<ss:Table>\n\n' + '<ss:Row>\n' + header + '</ss:Row>\n' + body + '\n</ss:Table>\n' + '</ss:Worksheet>\n' + '</ss:Workbook>\n';

	var blob = new Blob([table], {
		'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});

	// creates a temporary hidden anchor on the page
	var a = document.createElement('a');
	a.style = 'display: none';

	// adds the blob to the anchor
	var url = URL.createObjectURL(blob);
	a.href = url;

	// adds the table name to the downloaded file.  If none specified, the name is 'table'
	a.download = name + '.xls';

	// adds the anchor, click it, and removes it
	document.body.appendChild(a);
	a.click();
	a.parentNode.removeChild(a);
	window.URL.revokeObjectURL(url);
};