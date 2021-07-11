import { Purchases } from "../interfaces";
import {
  Tr,
  Td,
	Link,
	Table,
	Thead,
	Tbody,
	Th,
	Tfoot,
	useDisclosure
} from "@chakra-ui/react"
import ModalComp from './ModalComp'
import ReceiptItem from './ReceiptItem'

interface PurchaseItemProps {
	item: Purchases;
}

export default function PurchaseItem({ item } : PurchaseItemProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
  return (
	<>
		<Tr>
			<Td>
				<Link onClick={onOpen}>
					{new Date(item.dateCheckout).toDateString()}
				</Link>
			</Td>
		</Tr>
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="Receipt">
			<>
				<Table>
					<Thead>
						<Tr>
							<Th>Quantity:</Th>
							<Th>Description</Th>
							<Th isNumeric>Price</Th>
						</Tr>
					</Thead>
					<Tbody>
						{item?.cart && item?.cart.map((items) => {
							return(
									<ReceiptItem item={items} key={items.product.productId?.toString()}/>
							)
						})}
					</Tbody>
					<Tfoot>
						{(item.encashedPoints || item.encashedPoints > 0) && 
							<Tr>
								<Th/>
								<Td>Encashed Points: </Td>
								<Td isNumeric> -{item.encashedPoints}</Td>
							</Tr>
						}
						<Tr>
							<Th/>
							<Th/>
							<Th isNumeric>Total: P{item.encashedPoints ? item?.totalPrice-item?.encashedPoints : item?.totalPrice}</Th>
						</Tr>
					</Tfoot>
				</Table>
			</>
		</ModalComp>
		</>
  );
}