import React from 'react';
import QrReader from 'react-qr-reader';
import { useRouter } from 'next/router'
import { useMutation } from 'react-query';

interface OnStoreQRScannerProps {
	customerId: string | undefined
}

export default function OnStoreQRScanner({customerId} :OnStoreQRScannerProps) { 
	const Router = useRouter();
  const handleErrorWebCam = (error : any) => {
    console.log(error);
  }
  const handleScanWebCam = async (result: string | null) => {
    if (result == "true"){
			await fetch("api/profile/onStore",{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({id: customerId})
			})
			await Router.push("/store");
    }
  }
  return (
    <>
		<QrReader
			delay={300}
			style={{width: '100%'}}
			onError={handleErrorWebCam}
			onScan={handleScanWebCam}
		/>
		</>
  );
}
