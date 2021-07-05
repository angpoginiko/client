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
import StorageList from './StorageList';

interface StorageProps {
	storageProducts?: StorageDisplayProductType[];
	refetch: () => void;
}

export default function Storage({storageProducts, refetch} : StorageProps) {
  return (
				<VStack spacing="0" width="100%">
					<Table>
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Quantity</Th>
								<Th>Product Family</Th>
								<Th>Expiry Date</Th>
								<Th>Stock Status</Th>
								<Th>Expiry Status</Th>
								<Th>Options</Th>
							</Tr>
						</Thead>
						<Tbody>
						{storageProducts && storageProducts.map((items) => {
								return(
									<StorageList product={items} refetch={refetch} key={items.product?._id}/ >
								)
							})}
						</Tbody>
					</Table>
				</VStack>
  );
}