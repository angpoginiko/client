import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import {
  Box,
  Text,
  VStack,
	Center,
	Thead,
	Table,
	Th,
	Tr,
	Tbody,
	Tfoot,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config'
import { useRouter } from 'next/router'
import userRoles from '../constants/userRoles';
import { Purchases } from '../interfaces';
import PurchaseItem from '../components/PurchaseItem';


export default function Points({user, purchases} : any) {
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin')
		}
	}, [user])
  return (
    <>
		<Layout authentication={user}>
				<Box w="100%" h={{ base: "100px", md: "150px", lg: "200px" }} bg="#36B290">
					<Center>
						<VStack spacing="0">
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }} color="white">
								PURCHASE HISTORY
							</Text>
							<Table>
								<Thead>
									<Tr>
										<Th>Name:</Th>
										<Th>Quantity</Th>
										<Th isNumeric>Price</Th>
										<Th>Date</Th>
									</Tr>
								</Thead>
								<Tbody>
									{purchases.purchases && purchases.purchases.map((items: Purchases) => {
										return(
												<PurchaseItem item={items} key={purchases._id}/>
										)
									})}
								</Tbody>
							</Table>
						</VStack>
					</Center>
				</Box>	
		</Layout>
    </>
  );
}


Points.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
  const purchaseHistory = await frontEndAuthentication(`${server}/api/purchaseHistory/${user.id}`, ctx);
	const purchases: Purchases[] = purchaseHistory.purchases;
	return { user, purchases }
}