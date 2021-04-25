import { useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { ProductType } from '../interfaces';
import ModalComp from './ModalComp';
import Product from './Product';

interface QRScannerProps {
	customerId: string | undefined
}

export default function QRScanner({customerId} : QRScannerProps) { 
	const { onOpen, isOpen, onClose } = useDisclosure();
	const  [data, setData ] = useState<ProductType>();
  const handleErrorWebCam = (error : any) => {
    console.log(error);
  }
  const handleScanWebCam = async (result: string | null) => {
    if (result){
				const response = await fetch (`/api/products/product/${result}`, {
					method: "GET",
				})
				const unmappedData = await response.json();
				unmappedData.map((data: ProductType) => {
					setData(data);
				})
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
			<Product customerId={customerId} product={data} closeProduct={onClose}/>
		</ModalComp>
		</>
  );
}
