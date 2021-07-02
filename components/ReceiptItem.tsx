import { ProductType, UserCart } from "../interfaces";
import {
  Tr,
  Td,
	Checkbox
} from "@chakra-ui/react"
import { ChangeEvent } from "react";

interface ReceiptProps {
	item: UserCart;
}

export default function ReceiptItem({ item } : ReceiptProps) {
	let { productName, unitPrice } : ProductType = {}
	item.productData.map((data) => {
		productName = data.productName,
		unitPrice = data.unitPrice
	});
	
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if(e.target.name == item.product.productId?.toString()){
			item.product.hasContainer = e.target.checked;
		}
	}
  return (
		<Tr>
			<Td>
				{item.product.quantity}
			</Td>
			<Td>
				{productName}
			</Td>
			<Td isNumeric>
				{item.product.quantity * unitPrice!}
			</Td>
			<Td>
				<Checkbox name={item.product.productId?.toString()} defaultChecked={item.product.hasContainer} onChange={handleChange}/>
			</Td>
		</Tr>
  );
}