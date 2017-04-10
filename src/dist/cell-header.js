import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CellHeader extends Component {
	static propTypes = {
		setActive: PropTypes.func.isRequired,
		clearActive: PropTypes.func.isRequired,
		onSearch: PropTypes.func.isRequired,
		style: PropTypes.object.isRequired,
		active: PropTypes.bool.isRequired,
		column: PropTypes.object.isRequired,
		sort: PropTypes.object,
		onSortChange: PropTypes.func.isRequired
	}

	state = { filter: undefined }

	componentDidUpdate = (prevProps) => {
		if (!prevProps.active && this.props.active) {
			this.input.focus()
		}
	}

	areEqual = () => {
		const {
			state: { filter: stateFilter },
			props: { column: { filter: columnFilter } }
		} = this

		return (
			stateFilter === columnFilter ||
			(stateFilter === undefined && !columnFilter)
		)
	}

	onSearch = () => {
		if (this.areEqual()) {
			this.props.clearActive()
		} else {
			this.props.onSearch(this.state.filter)
		}
	}

	onKeyUp = ({ keyCode }) => {
		if (keyCode === 13) {
			this.onSearch()
		}
	}

	onClear = () => {
		if (this.state.filter) {
			this.setState({ filter: undefined })
		}
		if (this.props.column.filter) {
			this.props.onSearch('')
		}
	}

	onBlur = () => {
		if (this.areEqual()) {
			this.props.clearActive()
		}
	}

	onFilterChange = (evt) => {
		this.setState({ filter: evt.target.value })
	}

	render () {
		const { active, style, column, setActive, sort, onSortChange } = this.props

		const { filter: stateFilter } = this.state

		const { filter: columnFilter, name: columnName } = column

		const sortName = (
			<div
				onClick={column.value ? setActive : undefined}
				className={ `z-table--sort-name${column.filter ? ' z-table--active-sort-name' : ''}${column.value ? ' z-table--clickable-sort' : ''}` }
			>
				{column.filter || column.name}
			</div>
		)

		return (
			active
			? (
				<div className='z-table--cell-header' style={style}>
					<div className='z-table--head-input-container'>
						<input
							type='text'
							placeholder={columnName}
							onChange={this.onFilterChange}
							value={stateFilter === undefined ? columnFilter : stateFilter}
							ref={input => { this.input = input }}
							onBlur={this.onBlur}
							onKeyUp={this.onKeyUp}
						/>
						<i className="material-icons" onMouseDown={this.onSearch} style={{ cursor: 'pointer' }}>search</i>
						<i className="material-icons" onMouseDown={this.onClear} style={{ cursor: 'pointer' }}>close</i>
					</div>
				</div>
			) : (
				<div className='z-table--cell-header' style={style}>
					{
						column.alignRight
						? <div style={{ marginLeft: 'auto' }}>{sortName}</div>
						: sortName
					}
					{
						column.value && (
							<div onClick={onSortChange} style={{ marginLeft: column.alignRight ? '10px' : 'auto' }} className={ `z-table--sort${sort ? ' z-table--sort-active' : ''}` }>{sort && !sort.asc ? '▴' : '▾' }</div>
						)
					}
				</div>
			)
		)
	}
}

export default CellHeader
