import React from 'react'
import {
	Thead,
	Table,
	Th,
	Tr,
	Tbody,
	VStack,
} from '@chakra-ui/react';
import { ReceivedProducts } from '../interfaces';
import ReceivingList from './ReceivingList';

interface ReceivingProps {
	receivingProducts?: ReceivedProducts[];
}

export default function Receiving({receivingProducts} : ReceivingProps) {
  return (
				<VStack spacing="0" width="100%">
					<Table>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Quantity</Th>
								<Th>Unit of Measure</Th>
								<Th>Expiry Date</Th>
								<Th>Expiry Status</Th>
								<Th>Options</Th>
							</Tr>
						</Thead>
						<Tbody>
						{receivingProducts && receivingProducts.map((items) => {
								return(
									<ReceivingList product={items} key={items._id} />
								)
							})}
						</Tbody>
					</Table>
				</VStack>
  );
}