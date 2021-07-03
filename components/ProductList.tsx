import { ProductType } from "../interfaces";
import {
  Tr,
  Td,
	useDisclosure,
	Icon, 
	Box,
	HStack,
	Tooltip
} from "@chakra-ui/react"
import ModalComp from "./ModalComp";
import AddProduct from "./AddProduct"
import EditProduct from "./EditProduct"
import { MdAddBox, MdEdit } from 'react-icons/md';

interface ProductListProps {
	product: ProductType;
	refetchReceiving: () => void;
	refetchProducts: () => void;
}


export default function ProductList({ product, refetchReceiving, refetchProducts} : ProductListProps) {
	const {isOpen: isAddOpen , onOpen: onAddOpen, onClose: onAddClose} = useDisclosure();
	const {isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose} = useDisclosure();

	const toPascalCase = (text: string | undefined) => {
		const newString = text?.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		return newString;
	}
	return (
		<Tr>
			<Td>
			</Td>
			<Td>
				{product.productName}
			</Td>
			<Td>
				{toPascalCase(product.productType?.name)}
			</Td>
			<Td>
				{toPascalCase(product.unitOfMeasure?.name)}
			</Td>
			<Td>
				{product.unitPrice}
			</Td>
			<Td>
				{product.reorderingStock}
			</Td>
			<Td>
				<HStack>
					<Tooltip label="Add Product to Stock">
						<Box as="button" onClick={onAddOpen}>
							<Icon as={MdAddBox} boxSize={{base: 2, md: 3, lg: 6}}/>
						</Box>
					</Tooltip>
					<Tooltip label="Edit Product">
						<Box as="button" onClick={onEditOpen}>
							<Icon as={MdEdit} boxSize={{base: 2, md: 3, lg: 6}}/>
						</Box>
					</Tooltip>
				</HStack>
			</Td>
			<ModalComp isModalOpen={isAddOpen} onModalClose={onAddClose} title="">
				<AddProduct modalClose={onAddClose} refresh={refetchReceiving} productId={product._id} productName={product?.productName!}/>
			</ModalComp>

			<ModalComp isModalOpen={isEditOpen} onModalClose={onEditClose} title="">
				<EditProduct modalClose={onEditClose} refresh={refetchProducts} defaultValues={product}/>
			</ModalComp>
		</Tr>
  );
}