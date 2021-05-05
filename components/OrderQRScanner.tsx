import { useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { UserCart } from '../interfaces';
import ModalComp from './ModalComp';
import Receipt from './Receipt';


export default function OrderQRScanner() { 
	const { onOpen, isOpen, onClose } = useDisclosure();
	const  [data, setData ] = useState<UserCart[]>();
  const handleErrorWebCam = (error : any) => {
    console.log(error);
  }
  const handleScanWebCam = async (result: string | null) => {
    if (result){
				const response = await fetch (`/api/orders/order/${result}`, {
					method: "GET",
				})
				const orderData = await response.json();
				setData(orderData);
				onOpen();
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
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="Add to Cart">
			<Receipt items={data!}/>
		</ModalComp>
		</>
  );
}
