import React from 'react'
import ReactDOM from 'react-dom'

import ZTable from '../src'

import '../src/index.css'

ReactDOM.render(
	<div className='app'>
		<ZTable
			url='http://localhost/zing/web.portal/api/members/list/ZA'
			header={<div style={{ fontSize: '20px', padding: '10px' }}>Members</div>}
			columns={[
				{ name: 'First Name', value: 'firstName', flex: '0.25' },
				{ name: 'Last Name', value: 'lastName', flex: '0.25' },
				{ name: 'Email', value: 'email', flex: '0.2' },
				{ name: 'Msisdn', value: 'msisdn', flex: '0.2' },
				{
					name: 'Actions',
					flex: '0.1',
					value: 'edit',
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
	</div>,
	document.querySelector('#app')
)
