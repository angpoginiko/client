import { ProductType } from "../interfaces";
import {
  Tr,
  Td,
	useDisclosure,
	IconButton 
} from "@chakra-ui/react"
import ModalComp from "./ModalComp";
import AddProduct from "./AddProduct"
import { MdAddBox } from 'react-icons/md';

interface ProductListProps {
	product: ProductType;
	refetch: () => void;
}


export default function ProductList({ product, refetch } : ProductListProps) {
	const {isOpen: isAddOpen , onOpen: onAddOpen, onClose: onAddClose} = useDisclosure();

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
				<IconButton icon={<MdAddBox />} aria-label="Add Product" onClick={onAddOpen}/>
			</Td>
			<ModalComp isModalOpen={isAddOpen} onModalClose={onAddClose} title="">
				<AddProduct modalClose={onAddClose} refresh={refetch} productId={product._id} productName={product?.productName!}/>
			</ModalComp>
		</Tr>
  );
}