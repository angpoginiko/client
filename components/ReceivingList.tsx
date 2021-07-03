import { ReceivedProducts } from "../interfaces";
import {
  Tr,
  Td,
	// useDisclosure,
	Circle
} from "@chakra-ui/react"
// import ModalComp from "./ModalComp";
// import { MdAddBox } from 'react-icons/md';

interface ReceivingListProps {
	product: ReceivedProducts;
}


export default function ReceivingList({ product } : ReceivingListProps) {
	// const {isOpen: isAddOpen , onOpen: onAddOpen, onClose: onAddClose} = useDisclosure();

	const toPascalCase = (text: string | undefined) => {
		const newString = text?.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		return newString;
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
	return (
		<Tr>
			<Td>
				{product.product?.productName}
			</Td>
			<Td>
				{product.quantity}
			</Td>
			<Td>
				{toPascalCase(product.unitOfMeasure.name)}
			</Td>
			<Td>
			{new Date(product.expiryDate!).toDateString()}
			</Td>
			<Td>
				<Circle size="25px" bg={statusColor} />
			</Td>
			<Td>
				{/* To Stock here */}
			</Td>
		</Tr>
  );
}