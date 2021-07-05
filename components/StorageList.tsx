import { StorageDisplayProductType } from "../interfaces";
import {
  Tr,
  Td,
	useDisclosure,
	Circle,
	Tooltip,
	Box,
	Icon
} from "@chakra-ui/react"
import useCase from "../hooks/useCase";
import ModalComp from "./ModalComp";
import { MdAddBox } from 'react-icons/md';
import ToDisplay from "./ToDisplay";

interface StorageListProps {
	product: StorageDisplayProductType;
	refetch: () => void;
}


export default function StorageList({ product, refetch } : StorageListProps) {
	const {isOpen: isAddOpen , onOpen: onAddOpen, onClose: onAddClose} = useDisclosure();
	const { toPascalCase } = useCase();

	let expiryStatusColor = "red";
	let stockStatusColor = "red";
	const expiryDate = new Date(product.expiryDate);
	const dateToday = new Date();
	const daysRemaining = Math.ceil((Math.abs(expiryDate.getTime() - dateToday.getTime())) / (1000 * 60 * 60 * 24));
	if(daysRemaining >= 5 && daysRemaining < 7){
		expiryStatusColor = "yellow";
	} else if(daysRemaining >= 7){
		expiryStatusColor = "green";
	}
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
				{toPascalCase(product.product?.productType?.name!)}
			</Td>
			<Td>
				{new Date(product.expiryDate!).toDateString()}
			</Td>
			<Td>
				<Circle size="25px" bg={stockStatusColor} />
			</Td>
			<Td>
				<Tooltip label={`${daysRemaining} days`}>
					<Circle size="25px" bg={expiryStatusColor} />
				</Tooltip>
			</Td>
			<Td>
				<Box as="button" onClick={onAddOpen}>
					<Icon as={MdAddBox} boxSize={{base: 2, md: 3, lg: 6}}/>
				</Box>
			</Td>
			
			<ModalComp isModalOpen={isAddOpen} onModalClose={onAddClose} title="">
				<ToDisplay modalClose={onAddClose} stock={product} refresh={refetch}/>
			</ModalComp>
		</Tr>
  );
}