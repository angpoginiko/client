import { UserCart } from "../interfaces";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"
interface ReceiptProps {
	items: UserCart[];
}

export default function Receipt({ items } : ReceiptProps) { 
  return (
    <>
			<Table>
				<Thead>
					<Tr>
						<Th isNumeric>Quantity:</Th>
						<Th>Description:</Th>
						<Th>Amount:</Th>
					</Tr>
				</Thead>
				<Tfoot>
					<Tr>
						<Th></Th>
						<Th></Th>
						<Th isNumeric>Total: </Th>
					</Tr>
				</Tfoot>
			</Table>	
		</>
  );
}