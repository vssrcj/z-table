import React, { Component } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'

import CellHeader from './dist/cell-header'
import { exportTable } from './dist/utils'

export default class ZTable extends Component {
	static propTypes = {
		parse: PropTypes.func,
		header: PropTypes.node,
		columns: PropTypes.array.isRequired,
		url: PropTypes.string.isRequired,
		pageLength: PropTypes.number,
		defaultSort: PropTypes.object,
		name: PropTypes.string
	}

	static defaultProps = {
		parse: item => item,
		header: null,
		pageLength: 10,
		defaultSort: {
			value: undefined,
			asc: true
		}
	}

	constructor (props) {
		super(props)
		this.state = {
			data: undefined,
			activeColumn: null,
			activeSort: props.defaultSort,
			columns: props.columns.map(column => ({ ...column, filter: '' })),
			pageLength: props.pageLength,
			page: 1
		}
	}

	changeWrapper = func => {
		this.setState({ loading: true })
		const result = func()
		this.load(result)
		this.setState(result)
	}

	onSortChange = (value) => this.changeWrapper(() => ({
		activeSort: {
			value,
			asc: this.state.activeSort.value === value ? !this.state.activeSort.asc : true
		}
	}))

	onColumnSearch = (value, filter) => this.changeWrapper(() => {
		this.setActiveColumn(null)

		const columns = this.state.columns.map(column => (
			column.value === value
			? { ...column, filter }
			: column
		))

		return {
			columns
		}
	})

	onPagerChange = (event) => this.changeWrapper(() => ({
		pageLength: event.target.value
	}))

	componentWillMount () {
		this.load()
	}

	parseAll = result => ({
		hasMore: result.hasMore,
		items: result.items.map(this.props.parse)
	})

	extract = (key, data) => (
		data[key] === undefined ? this.state[key] : data[key]
	)

	load (data = {}, callback) {
		const page = data.page === undefined ? 1 : data.page
		const columns = this.extract('columns', data)
		const sort = this.extract('activeSort', data)
		const pageLength = this.extract('pageLength', data)

		const params = {}

		columns.forEach(column => {
			if (column.filter) {
				params[column.value] = column.filter
			}
		})

		if (sort) {
			params['sort'] = `${sort.asc ? '+' : '-'}${sort.value}`
		}

		axios.post(
			this.props.url,
			{
				'page': page || 1,
				'pageLength': pageLength,
				...params
			}
		).then(result => {
			const data = this.parseAll(result.data)
			this.setState({
				data,
				page,
				loading: false
			})
			if (callback) callback(data.items)
		})
	}

	renderCell = (column, item) => (
		column.component
		? column.component(item)
		: item[column.value]
	)

	setActiveColumn = (activeColumn) => {
		this.setState({ activeColumn })
	}

	onExport = () => this.load({}, items => (
		exportTable(
			items,
			this.state.columns.filter(column => column.value),
			this.props.name
		)
	))

	renderFromPage = () => {
		const { page, pageLength } = this.state
		return (page - 1) * pageLength + 1
	}

	renderToPage = () => {
		const { page, pageLength } = this.state
		return page * pageLength
	}

	changePage = (page) => () => this.changeWrapper(() => ({ page }))

	renderPaging = () => {
		const { page, pageLength, data: { items, hasMore } } = this.state
		const length = items.length

		return (
			<div className="z-table--pagination">
				{
					!hasMore && page === 1
					? null
					: <span className={ `z-table--page ${page === 1 ? 'z-table--page-active' : ''}` } onClick={this.changePage(1)}>1</span>
				}
				{ page > 3 ? <span className="z-table--page--disabled">...</span> : null }
				{ page > 2 ? <span onClick={this.changePage(page - 1)} className="z-table--page">{ page - 1 }</span> : null }
				{ page > 1 ? <span className="z-table--page z-table--page-active">{ page }</span> : null }
				{ hasMore ? <span onClick={this.changePage(page + 1)} className="z-table--page">{ page + 1 }</span> : null }
				{ hasMore || parseInt(length / pageLength) > page ? <span className="z-table--page--disabled">...</span> : null }
			</div>
		)
	}

	render () {
		const {
			state: { data, columns, activeColumn, loading, activeSort, pageLength },
			props: { header, name }
		} = this

		if (data === undefined) return <div>Loading....</div>

		return (
			<div className='z-table'>
				<div className='z-table--header'>
					{ header }
				</div>
				<div className='z-table--sub-header'>
					<input type='number' min='1' max='50' value={pageLength} onChange={this.onPagerChange} />
					{ name ? <button className='z-table--button' onClick={this.onExport}>Export</button> : null }
				</div>
				<div>
					<div className='z-table--head-wrapper'>
						<div className='z-table--head'>
							{
								columns.map((column, c) =>
									<CellHeader
										active={column.value === activeColumn}
										sort={column.value === activeSort.value ? activeSort : undefined}
										style={{ flex: column.flex }}
										setActive={() => this.setActiveColumn(column.value)}
										clearActive={() => this.setActiveColumn(null)}
										onSearch={filter => this.onColumnSearch(column.value, filter)}
										onSortChange={() => this.onSortChange(column.value)}
										column={column}
										key={c}
									/>
								)
							}
						</div>
					</div>
					<div className='z-table--body'>
						{
							loading
							? <div className='z-table--loader' />
							: (
								data.items.map((item, i) => (
									<div className='z-table--row' key={i}>
										{
											columns.map((column, c) => (
												<div key={c} style={{ flex: column.flex, marginLeft: item.alignRight ? 'auto' : '0' }}>
													{
														column.alignRight
														? <div style={{ marginLeft: 'auto' }}>{this.renderCell(column, item)}</div>
														: this.renderCell(column, item)
													}
												</div>
											))
										}
									</div>
								))
							)
						}
					</div>
					<div className='z-table--footer'>
						{ `Showing ${this.renderFromPage()} - ${this.renderToPage()} entries` }
						{ this.renderPaging() }
					</div>
				</div>
			</div>
		)
	}
}
