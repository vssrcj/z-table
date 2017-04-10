import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ children }) => (
	<button className='z-table--button'>{children}</button>
)

Button.propTypes = {
	children: PropTypes.node.isRequired,
	color: PropTypes.string
}

Button.defaultProps = {
	color: '#bbb'
}

export default Button
