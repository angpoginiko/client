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
import PageLoader from './PageLoader';

interface StorageProps {
	storageProducts?: StorageDisplayProductType[];
	refetch: () => void;
	isStockFetching: boolean;
}

export default function Storage({storageProducts, refetch, isStockFetching} : StorageProps) {
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
						{!isStockFetching ? storageProducts && storageProducts.map((items) => {
								return(
									<StorageList product={items} refetch={refetch} key={items.product?._id}/ >
								)
							}): <PageLoader size="xl"/>}
						</Tbody>
					</Table>
				</VStack>
  );
}