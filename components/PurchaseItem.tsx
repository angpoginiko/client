import { ProductType, Purchases } from "../interfaces";
import {
  Tr,
  Td,
} from "@chakra-ui/react"
import { useQuery } from "react-query";
interface PurchaseItemProps {
	item: Purchases;
}

export default function ReceiptItem({ item } : PurchaseItemProps) {
	const fetchCart = async () => {
		const res = await fetch(`api/products/product/${item.productId}`);
		return res.json();
	}
	
	const { data: product } = useQuery<ProductType>("product", fetchCart);
	const itemName = product?.productName;
  return (
		<Tr>
			<Td>
				{itemName}
			</Td>
			<Td>
				{item.quantity}
			</Td>
			<Td>
				{(item.quantity * product?.unitPrice!).toString()}
			</Td>
			<Td>
				{new Date(item.dateCheckout).toDateString()}
			</Td>
		</Tr>
  );
}