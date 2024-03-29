import { ReceivedProducts } from "../interfaces";
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
import ToStock from "./ToStock";
import ModalComp from "./ModalComp";
import { MdAddBox } from 'react-icons/md';

interface ReceivingListProps {
	product: ReceivedProducts;
	refetch: () => void;
}


export default function ReceivingList({ product, refetch } : ReceivingListProps) {
	const {isOpen: isAddOpen , onOpen: onAddOpen, onClose: onAddClose} = useDisclosure();
	const { toPascalCase } = useCase();

	let statusColor = "red";
	const expiryDate = new Date(product.expiryDate);
	const dateToday = new Date();
	const daysRemaining = Math.ceil((Math.abs(expiryDate.getTime() - dateToday.getTime())) / (1000 * 60 * 60 * 24));
	if(daysRemaining >= 5 && daysRemaining < 7){
		statusColor = "yellow";
	} else if(daysRemaining >= 7){
		statusColor = "green";
	}
	return (
		<Tr>
			<Td>
				{product.product?.productName}
			</Td>
			<Td>
				{product.quantity} {toPascalCase(product.unitOfMeasure.name)}
			</Td>
			<Td>
				{toPascalCase(product.product.productType!.name)}
			</Td>
			<Td>
				{new Date(product.expiryDate!).toDateString()}
			</Td>
			<Td>
				<Tooltip label={`${daysRemaining} days`}>
					<Circle size="25px" bg={statusColor} />
				</Tooltip>
			</Td>
			<Td>
				<Box as="button" onClick={onAddOpen}>
					<Icon as={MdAddBox} boxSize={{base: 2, md: 3, lg: 6}}/>
				</Box>
			</Td>
			<ModalComp isModalOpen={isAddOpen} onModalClose={onAddClose} title="">
				<ToStock 
					receivingProductId={product._id} 
					productId={product.product._id!} 
					quantity={product.quantity}
					modalClose={onAddClose}
					refresh={refetch}
					expiryDate={product.expiryDate}
					productUnitOfMeasure={product.product.unitOfMeasure!.name}
					receivingUnitOfMeasure={product.unitOfMeasure.name}
				/>
			</ModalComp>
		</Tr>
  );
}