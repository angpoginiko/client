import { ProductType, UserCart } from "../interfaces";
import {
  Tr,
  Td,
	Checkbox
} from "@chakra-ui/react"

interface ReceiptProps {
	item: UserCart;
}

export default function ReceiptItem({ item } : ReceiptProps) {
	let { productName, unitPrice } : ProductType = {}
	item.productData.map((data) => {
		productName = data.productName,
		unitPrice = data.unitPrice
	});
  return (
		<Tr>
			<Td>
				{item.product.quantity} {item.unitOfMeasure}
			</Td>
			<Td>
				{productName}
			</Td>
			<Td isNumeric>
				{item.product.quantity * unitPrice!}
			</Td>
		</Tr>
  );
}