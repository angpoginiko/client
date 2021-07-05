import React from 'react'
import {
	Thead,
	Table,
	Th,
	Tr,
	Tbody,
	VStack,
} from '@chakra-ui/react';
import { StorageDisplayProductType } from '../interfaces';
import DisplayList from './DisplayList';

interface StorageProps {
	displayProducts?: StorageDisplayProductType[];
	refetch: () => void;
}

export default function Storage({displayProducts, refetch} : StorageProps) {
  return (
				<VStack spacing="0" width="100%">
					<Table>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Quantity</Th>
								<Th>Price per (unit of measure)</Th>
								<Th>Product Family</Th>
								<Th>Display Capacity</Th>
								<Th>Expiry Date</Th>
								<Th>Stock Status</Th>
								<Th>Expiry Status</Th>
							</Tr>
						</Thead>
						<Tbody>
						{displayProducts && displayProducts.map((items) => {
								return(
									<DisplayList product={items} refetch={refetch} key={items.product?._id}/>
								)
							})}
						</Tbody>
					</Table>
				</VStack>
  );
}