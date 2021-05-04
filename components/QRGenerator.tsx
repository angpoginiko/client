import React, {useState} from 'react';
import QRCode from 'qrcode';
import { Button, Input } from '@chakra-ui/react';


export default function QRGenerator() { 
  const [text, setText] = useState('');
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
    <Input label="Enter Text Here" onChange={(e) => setText(e.target.value)}/>
			<Button onClick={() => generateQrCode()}>Generate</Button>
				<br/>
				<br/>
				<br/>
			{imageUrl ? (
				<a href={imageUrl} download>
						<img src={imageUrl} alt="img" width="500" height="500"/>
				</a>) : null}
		</>
  );
}

