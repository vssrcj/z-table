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
				<div style={{ background: '#f7f7f7', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '8px 16px' }}>
					Loading
					{ Array(this.state.count).fill().map((_, i) => <span key={i}>.</span>) }
				</div>
			)
		}
		return (
			<div style={{ background: '#fff', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '8px 16px' }}>
				Loading
				{ Array(this.state.count).fill().map((_, i) => <span key={i}>.</span>) }
			</div>
		)
	}
}