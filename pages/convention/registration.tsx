// pages/index.tsx

import React from 'react';
import { Ticket } from '../../utility/DataType';

const Registration = ({ username}: Ticket) => {

	return (
		<div>
			<h1>Welcome {username}</h1>

		</div>
	);
};

Registration.getInitialProps = async (context: any) => {
	const { query } = context;
	return {
		username: query.username || '',
		irlEvent: query.irlEvent || 0
	};
};

export default Registration;