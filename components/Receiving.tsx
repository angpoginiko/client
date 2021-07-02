import React from 'react'
import {
	Thead,
	Table,
	Th,
	Tr,
	Tbody,
	VStack,
} from '@chakra-ui/react';
import { ProductType } from '../interfaces';
import ReceivingList from './ReceivingList';
import { useQuery } from 'react-query';


export default function Receiving() {
	const fetchCart = async () => {
		const res = await fetch("api/products/getProducts");
		return res.json();
	}
	const { data: products, refetch } = useQuery<ProductType[]>("product", fetchCart);
  return (
				<VStack spacing="0" width="100%">
					<Table>
						<Thead>
							<Tr>
								<Th>Name:</Th>
								<Th>Quantity</Th>
								<Th>Price</Th>
								<Th>Product Family</Th>
								<Th>Options</Th>
							</Tr>
						</Thead>
						<Tbody>
						{products && products.map((items: ProductType) => {
								return(
									<ReceivingList product={items} key={items._id} refetch={refetch}/>
								)
							})}
						</Tbody>
					</Table>
				</VStack>
  );
}