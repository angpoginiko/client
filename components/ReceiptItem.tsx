import { ProductType, UserCart } from "../interfaces";
import {
  Tr,
  Td,
} from "@chakra-ui/react"
interface ReceiptProps {
	item: UserCart;
	setTotalPrice: (totalPrice: number) => void;
}

export default function ReceiptItem({ item, setTotalPrice } : ReceiptProps) {
	let { productName, unitPrice } : ProductType = {}
	item.productData.map((data) => {
		productName = data.productName,
		unitPrice = data.unitPrice
	});
	setTotalPrice(item.total!);
  return (
		<Tr>
			<Td>
				{item.product.quantity}
			</Td>
			<Td>
				{productName}
			</Td>
			<Td>
				{item.product.quantity * unitPrice!}
			</Td>
		</Tr>
  );
}