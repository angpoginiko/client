import {  StorageDisplayProductType } from "../interfaces";
import {
  Tr,
  Td,
	Circle,
	Tooltip,
	Icon
} from "@chakra-ui/react"
import useCase from "../hooks/useCase";
import QRCode from 'qrcode';
import { useState } from "react";
import { MdPrint } from 'react-icons/md';

interface DisplayListProps {
	product: StorageDisplayProductType;
	refetch: () => void;
}


export default function DisplayList({ product } : DisplayListProps) {
	const { toPascalCase } = useCase();
	const [imageUrl, setImageUrl] = useState('');

	const generateQrCode = async () => {
		try {
			const response = await QRCode.toDataURL(product._id!);
			setImageUrl(response);
		}catch (error) {
			console.log(error);
		}
	}

	let statusColor = "red";
	const expiryDate = new Date(product.expiryDate);
	const dateToday = new Date();
	const daysRemaining = Math.ceil((Math.abs(expiryDate.getTime() - dateToday.getTime())) / (1000 * 60 * 60 * 24));
	if(daysRemaining >= 5 && daysRemaining < 7){
		statusColor = "yellow";
	} else if(daysRemaining >= 7){
		statusColor = "green";
	}

	let stockStatusColor = "red";
	if(product.quantity! >= (product.product?.reorderingStorageStock!/2) 
	&& product.quantity! < ((product.product?.reorderingStorageStock! * 0.75))){
		stockStatusColor = "yellow";
	} else if(product.quantity! > product.product?.reorderingStorageStock! * 0.8){
		stockStatusColor = "green";
	}
	return (
		<Tr>
			<Td>
				{product.product?.productName}
			</Td>
			<Td>
				{product.quantity} {toPascalCase(product.product?.unitOfMeasure?.name!)}
			</Td>
			<Td>
				{product.product?.unitPrice}
			</Td>
			<Td>
				{toPascalCase(product.product!.productType!.name)}
			</Td>
			<Td>
				{product.product?.capacity}
			</Td>
			<Td>
				{new Date(product.expiryDate!).toDateString()}
			</Td>
			<Td>
				<Circle size="25px" bg={stockStatusColor} />
			</Td>
			<Td>
				<Tooltip label={`${daysRemaining} days`}>
					<Circle size="25px" bg={statusColor} />
				</Tooltip>
			</Td>
			<Td>
				<a href={imageUrl} download onClick={() => {generateQrCode(), imageUrl}} title="Download QR">
						<Icon as={MdPrint} boxSize={{base: 2, md: 3, lg: 6}}/>
				</a>
			</Td>
		</Tr>
  );
}