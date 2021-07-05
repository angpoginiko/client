import {  StorageDisplayProductType } from "../interfaces";
import {
  Tr,
  Td,
	Circle,
	Tooltip,
} from "@chakra-ui/react"
import useCase from "../hooks/useCase";

interface DisplayListProps {
	product: StorageDisplayProductType;
	refetch: () => void;
}


export default function DisplayList({ product } : DisplayListProps) {
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
		</Tr>
  );
}