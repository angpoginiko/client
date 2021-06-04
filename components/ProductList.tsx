import { ProductType, ProductTypeType } from "../interfaces";
import {
  Tr,
  Td,
	Box,
	Icon,
	HStack,
	useDisclosure
} from "@chakra-ui/react"
import { MdPrint, MdEdit } from 'react-icons/md';
import ModalComp from "./ModalComp";
import EditProduct from './EditProduct'
import QRCode from 'qrcode';
import { useState } from "react";

interface PurchaseItemProps {
	product: ProductType;
	refetch: () => void;
}


export default function ReceiptItem({ product, refetch } : PurchaseItemProps) {
	const [imageUrl, setImageUrl] = useState('');
	const {isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose} = useDisclosure();
	
	const generateQrCode = async () => {
		try {
			const response = await QRCode.toDataURL(product._id!);
			setImageUrl(response);
		}catch (error) {
			console.log(error);
		}
	}

	const toPascalCase = (text: string | undefined) => {
		const newString = text?.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		return newString;
	}
	return (
		<Tr>
			<Td>
				{product.productName}
			</Td>
			<Td>
				{product.quantity}
			</Td>
			<Td>
				{product.unitPrice?.toString()}
			</Td>
			<Td>
				{toPascalCase(product.productType?.name)}
			</Td>
			<Td>
				<HStack>
					<Box as="button" onClick={onEditOpen} title="Edit Product">
						<Icon as={MdEdit} boxSize={{base: 2, md: 3, lg: 6}}/>
					</Box>
					<a href={imageUrl} download onClick={() => {generateQrCode(), imageUrl}} title="Download QR">
						<Icon as={MdPrint} boxSize={{base: 2, md: 3, lg: 6}}/>
					</a>
				</HStack>
			</Td>
			<ModalComp isModalOpen={isEditOpen} onModalClose={onEditClose} title="">
				<EditProduct modalClose={onEditClose} refresh={refetch} defaultValues={product}/>
			</ModalComp>
		</Tr>
  );
}