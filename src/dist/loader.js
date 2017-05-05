import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Loading extends Component {
	static propTypes = {
		inRow: PropTypes.bool
	}

	static defaultProps = {
		inRow: false
	}

	state = {
		count: 1
	}

	componentWillMount () {
		this.timer = setInterval(this.timer, 300)
	}

	componentWillUnmount () {
		clearInterval(this.timer)
	}

	timer = () => {
		const { count } = this.state
		this.setState({ count: count > 2 ? 0 : count + 1 })
	}

	render () {
		if (this.props.inRow) {
			return (
				<div className='z-table--loader-in-row'>
					Loading
					{ Array(this.state.count).fill().map((_, i) => <span key={i}>.</span>) }
				</div>
			)
		}
		return (
			<div className='z-table--loader'>
				Loading
				{ Array(this.state.count).fill().map((_, i) => <span key={i}>.</span>) }
			</div>
		)
	}
}
