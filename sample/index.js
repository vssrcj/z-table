import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import ZTable from '../src'

import '../index.css'

class App extends Component {
	state = { exporter: null }

	setExport = (exporter) => {
		this.setState({ exporter })
	}

	render () {
		return (
			<div className='app'>
				<div className='app--header'>
					<div className='app--title'>Members</div>
					<div className='app--export' onClick={this.state.exporter}>Export</div>
				</div>
				<ZTable
					url='http://localhost/zing/web.portal/api/members/list/ZA'
					name='members'
					setExport={this.setExport}
					columns={[
						{ name: 'First Name', value: 'firstName', style: { flex: '0.25' } },
						{ name: 'Last Name', value: 'lastName', style: { flex: '0.25' } },
						{ name: 'Email', value: 'email', style: { flex: '0.2' } },
						{ name: 'Msisdn', value: 'msisdn', style: { flex: '0.2' }, alignRight: true },
						{
							name: 'Actions',
							style: { flex: '0.1' },
							alignRight: true,
							component: () => (
								<div>
									<i className="material-icons action">edit</i>
									<i className="material-icons action">close</i>
								</div>
							)
						}
					]}
				/>
			</div>
		)
	}
}


ReactDOM.render(
	<App />,
	document.querySelector('#app')
)
