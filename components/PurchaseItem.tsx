import { ProductType, Purchases } from "../interfaces";
import {
  Tr,
  Td,
	Link
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
  return (
		<Tr>
			<Td>
				<Link>
					{new Date(item.dateCheckout).toDateString()}
				</Link>
			</Td>
		</Tr>
  );
}