// pages/index.tsx

import React from 'react';
import { Accounts } from '../../utility/DataType';

const Dashboard = ({ username, irlEvent}: Accounts) => {

	return (
		<div>
			<h1>Welcome {username}</h1>
			<a href="/logout">Logout</a>
			<p>My profile :</p>
			<a href='/dashboard/account'>My Account</a>
			<br />
			<a href='/convention/profile'>Convention Profile</a>
			<br />
			<a href='/convention/friends-group'>My Friends Group</a>
			<br />
			<a href='/convention/attendees'>Attendees</a>
			<br />
			<p>Staff Zone:</p>
			<a href='/ticketing/reader'>QR Reader</a>
			<br />
			<a href='/admin/users/manage'>Users Management</a>
			<br />
			<p>Convention :</p>
			<a href='/convention/registration'>My Registration</a>
			<br />
			<a href='/schedule'>Planning</a>
			<br />
			<a href='/convention/conbook'>ConBook</a>
			<br />
			<a href='/dealers-den'>Dealer's Den</a>
			<br />
			<a href='/menu'>What's on the Menu ?</a>
			<br />
			<a href='/map'>Map</a>
			<br />
			<p>Creator Mode</p>
			<br />
			<p>Streamer Mode</p>
			<br />
		</div>
	);
};

Dashboard.getInitialProps = async (context: any) => {
	const { query } = context;
	return {
		username: query.username || '',
		irlEvent: query.irlEvent || 0
	};
};

export default Dashboard;