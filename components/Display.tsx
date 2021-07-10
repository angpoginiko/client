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
import PageLoader from './PageLoader';

interface StorageProps {
	displayProducts?: StorageDisplayProductType[];
	refetch: () => void;
	isDisplayRefetching: boolean;
}

export default function Storage({displayProducts, refetch, isDisplayRefetching} : StorageProps) {
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
						{!isDisplayRefetching ? displayProducts && displayProducts.map((items) => {
								return(
									<DisplayList product={items} refetch={refetch} key={items.product?._id}/>
								)
							}): <PageLoader size="xl"/>}
						</Tbody>
					</Table>
				</VStack>
  );
}