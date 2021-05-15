import { ProductType } from "../interfaces";
import {
  Tr,
  Td,
} from "@chakra-ui/react"
interface PurchaseItemProps {
	product: ProductType;
}

export default function ReceiptItem({ product } : PurchaseItemProps) {
  return (
		<Tr>
			<Td>
				{product.productName}
			</Td>
			<Td>
				{product.quantity}
			</Td>
			<Td>
				{product.unitPrice?.toString()}
			</Td>
			<Td>
				{product.productType}
			</Td>
		</Tr>
  );
}