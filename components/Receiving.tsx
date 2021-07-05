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
	refetch: () => void;
}

export default function Receiving({receivingProducts, refetch} : ReceivingProps) {
  return (
				<VStack spacing="0" width="100%">
					<Table>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Quantity</Th>
								<Th>Product Family</Th>
								<Th>Expiry Date</Th>
								<Th>Expiry Status</Th>
								<Th>Options</Th>
							</Tr>
						</Thead>
						<Tbody>
						{receivingProducts && receivingProducts
						.sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime())
						.map((items) => {
								return(
									<ReceivingList product={items} key={items._id} refetch={refetch}/>
								)
							})}
						</Tbody>
					</Table>
				</VStack>
  );
}