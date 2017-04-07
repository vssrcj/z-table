import React, { Component, PropTypes } from 'react'

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
		console.log('search')
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

		return (
			active
			? (
				<div className='z-table--cell-header' style={style}>
					<div style={{ display: 'flex', width: '100%', background: '#fff', padding: '4px' }}>
						<input
							className='z-table--head-input'
							type='text'
							placeholder={columnName}
							onChange={this.onFilterChange}
							style={{ flex: '1', border: 'none', outline: 'none' }}
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
						? <span style={{ marginLeft: 'auto' }}>{column.name}</span>
						: <div onClick={setActive} style={{ cursor: 'pointer',
							display: 'flex', flex: '1', alignItems: 'center', fontWeight: column.filter ? 'bold' : 'inherit', color: column.filter ? '#000' : 'inherit' }}>{column.filter || column.name}</div>
					}
					<i className="material-icons" onClick={onSortChange}
						style={{ marginLeft: column.alignRight ? '10px' : 'auto', cursor: 'pointer', color: sort ? '#333' : '#ccc' }}>
							{ sort && !sort.asc ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }
					</i>
				</div>
			)
		)
	}
}

export default CellHeader
