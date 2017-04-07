import React, { Component, PropTypes } from 'react'

import axios from 'axios'

import CellHeader from './dist/cell-header'

export default class ZTable extends Component {
	static propTypes = {
		parse: PropTypes.func,
		header: PropTypes.node,
		columns: PropTypes.array.isRequired,
		url: PropTypes.string.isRequired,
		pageLength: PropTypes.number,
		defaultSort: PropTypes.object
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
			activeColumn: undefined,
			activeSort: props.defaultSort,
			columns: props.columns.map(column => ({ ...column, filter: '' })),
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
		this.setActiveColumn(undefined)

		const columns = this.state.columns.map(column => (
			column.value === value
			? { ...column, filter }
			: column
		))

		return {
			columns
		}
	})

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

	load (data = {}, callBack) {
		const page = data.page === undefined ? 1 : data.page
		const columns = this.extract('columns', data)
		const sort = this.extract('activeSort', data)

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
				'pageLength': this.props.pageLength,
				...params
			}
		).then(result => {
			this.setState({
				data: this.parseAll(result.data),
				page,
				loading: false
			})
			if (callBack) callBack()
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

	renderFromPage = () => {
		const { state: { page }, props: { pageLength } } = this
		return (page - 1) * pageLength + 1
	}

	renderToPage = () => {
		const { state: { page }, props: { pageLength } } = this
		return page * pageLength
	}

	changePage = (page) => () => this.changeWrapper(() => ({ page }))

	renderPaging = () => {
		const { state: { page, data: { items, hasMore } }, props: { pageLength } } = this
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
			state: { data, columns, activeColumn, loading, activeSort },
			props: { header }
		} = this

		if (data === undefined) return <div>Loading....</div>

		return (
			<div className='z-table'>
				<div>
					{ header }
				</div>
				<div>
					<div className='z-table--head-wrapper'>
						<div className='z-table--head'>
							{
								columns.map(column =>
									<CellHeader
										active={column.value === activeColumn}
										sort={column.value === activeSort.value ? activeSort : undefined}
										style={{ flex: column.flex }}
										setActive={() => this.setActiveColumn(column.value)}
										clearActive={() => this.setActiveColumn(undefined)}
										onSearch={filter => this.onColumnSearch(column.value, filter)}
										onSortChange={() => this.onSortChange(column.value)}
										column={column}
										key={column.value}
									/>
								)
							}
						</div>
					</div>
					<div className='z-table--body' style={{ overflowY: 'scroll', height: 'calc(100vh - 144px)', overflowX: 'hidden' }}>
						{
							loading
							? <div className='z-table--loading'>Loading...</div>
							: (
								data.items.map((item, i) => (
									<div className='z-table--row' key={i}>
										{
											columns.map(column => (
												<div key={column.value} style={{ flex: column.flex, marginLeft: item.alignRight ? 'auto' : '0' }}>
													{
														column.alignRight ? (
															<div style={{ margin: '0 20px 0 auto' }}>{this.renderCell(column, item)}</div>
														) : this.renderCell(column, item)
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

const numberStyle = {
	width: '24px',
	height: '24px',
	display: 'inline-flex',
	alignItems: 'center',
	background: '#888',
	color: '#fff',
	justifyContent: 'center',
	cursor: 'pointer'
}
