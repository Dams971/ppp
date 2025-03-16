// pages/index.tsx

import React from 'react';
import Navbar from '../components/Navbar';

const Vitrine = () => {

	return (
		<div>
			<Navbar />
			<div className="">
				
			</div>
		</div>
	);
};


Vitrine.getInitialProps = async (context: any) => {
	const { query } = context;
	return {
		username: query.username || '', /* C'est un exemple */
		irlEvent: query.irlEvent || 0
	};
};

export default Vitrine;