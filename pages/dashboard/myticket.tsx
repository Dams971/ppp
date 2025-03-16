// pages/index.tsx

import React from 'react';
import { QRCode } from "react-qrcode-logo";

interface TicketProps {
	code: string;
}

const MyTicket = ({ code }: TicketProps) => {
	return (
		<div>
			<h1>Page qui affiche notre billet avec les informations</h1>
			<br></br>
			{ /*bgColor: #fd9141  */ }
			<QRCode
				removeQrCodeBehindLogo={false}
				logoImage={"/img/logo_gold.png"}
				logoHeight={150}
				logoWidth={150}
				logoOpacity={0.5}
				logoPaddingStyle={"circle"}
				size={350}
				value={code}
				ecLevel={"H"}
				fgColor={"#000000"}
				bgColor={"#ffffff"}
				quietZone={50}
				eyeColor={"#000000"}
				eyeRadius={[
					{
					  outer: [10, 10, 10, 10],
					  inner: [1, 1, 1, 1],
					},
					{
					  outer: [10, 10, 10, 10],
					  inner: [1, 1, 1, 1],
					},
					{
					  outer: [10, 10, 10, 10],
					  inner: [1, 1, 1, 1],
					},
				  ]}
				qrStyle={"squares"}
			/>
		</div>
	);
};

MyTicket.getInitialProps = async (context: any) => {
	const { query } = context;
	return {
		code: query.code || '',
	};
};

export default MyTicket;