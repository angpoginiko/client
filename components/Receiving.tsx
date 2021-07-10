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
import PageLoader from './PageLoader';

interface ReceivingProps {
	receivingProducts?: ReceivedProducts[];
	refetch: () => void;
	isReceivingFetching: boolean;
}

export default function Receiving({receivingProducts, refetch, isReceivingFetching} : ReceivingProps) {
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
						{!isReceivingFetching ? receivingProducts && receivingProducts
						.sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime())
						.map((items) => {
								return(
									<ReceivingList product={items} key={items._id} refetch={refetch}/>
								)
							}) : <PageLoader size="xl"/>}
						</Tbody>
					</Table>
				</VStack>
  );
}