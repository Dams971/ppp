import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';

const Reader = () => {
    const [data, setData] = useState('En attente de scan');

    const handleQrResult = async (result: any) => {
        if (!!result) {

            try {
                const response = await axios.get(`/ticketing/verify/${result}`);

                setData(JSON.stringify(JSON.parse(JSON.stringify(response.data))));
            } catch (error) {
                console.error('Erreur lors de l\'envoi des données:', error);
            }
        }
    };

    return (
        <>
        <h2>Convention Fur'Agora QR Code Reader</h2>
        
            { /* <QrReader
                onResult={(result, error) => {
                    if (!!result) handleQrResult(result);
                }} 
                constraints={{ facingMode: "environment", noiseSuppression: true,   }}
                scanDelay={ 0 }
            /> */ }
            <Scanner onScan={(result) => {
                handleQrResult(result[result.length-1].rawValue);
            }} />
            <p>{data}</p>
        </>
    );
};

export default Reader;