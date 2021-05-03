import React, {useState} from 'react';
import QRCode from 'qrcode';
import { Button } from '@chakra-ui/react';

interface QRGeneratorProps {
	text: string;
	buttonName: string;
	isCreated: boolean;
	setIsCreated: (isCreated: boolean) => void;
}

export default function QRGenerator({text, buttonName, isCreated, setIsCreated} : QRGeneratorProps) { 
  const [imageUrl, setImageUrl] = useState('');


  const generateQrCode = async () => {
    try {
			const response = await QRCode.toDataURL(text);
			setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }
  return (
		<>
			{isCreated && 
				<Button 
				onClick={() => {setIsCreated(false),generateQrCode()}}>
					{buttonName}
				</Button>
			}
			{imageUrl && 
				<img src={imageUrl} alt="img" width="500" height="500"/>}
		</>
  );
}

