import { ProductType, ProductTypeType } from "../interfaces";
import {
  Tr,
  Td,
	Box,
	Icon,
	HStack,
	useDisclosure
} from "@chakra-ui/react"
import { MdDelete, MdEdit } from 'react-icons/md';
import ModalComp from "./ModalComp";
import EditProduct from './EditProduct'
import { useQuery } from "react-query";


interface PurchaseItemProps {
	product: ProductType;
	refetch: () => void;
}


export default function ReceiptItem({ product, refetch } : PurchaseItemProps) {
	const {isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose} = useDisclosure();

	const fetchCart = async () => {
		const res = await fetch(`api/productType/productTypes/${product.productType}`);
		return res.json();
	}
	
	const { data: productType } = useQuery<ProductTypeType>("productType", fetchCart);
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
				{productType?.name}
			</Td>
			<Td>
				<HStack>
					<Box as="button" onClick={onEditOpen}>
						<Icon as={MdEdit} boxSize={{base: 2, md: 3, lg: 6}}/>
					</Box>
					Generate QR
				</HStack>
			</Td>
			<ModalComp isModalOpen={isEditOpen} onModalClose={onEditClose} title="">
				<EditProduct modalClose={onEditClose} refresh={refetch} defaultValues={product}/>
			</ModalComp>
		</Tr>
  );
}