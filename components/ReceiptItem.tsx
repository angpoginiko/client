import { UserCart } from "../interfaces";
import {
  Tr,
  Td,
} from "@chakra-ui/react"

interface ReceiptProps {
	item: UserCart;
}

export default function ReceiptItem({ item } : ReceiptProps) {
  return (
		<Tr>
			<Td>
				{item.product.quantity} {item.unitOfMeasure}
			</Td>
			<Td>
				{item.productData.productName}
			</Td>
			<Td isNumeric>
				{item.product.quantity * item.productData.unitPrice!}
			</Td>
		</Tr>
  );
}