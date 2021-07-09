import React, { useEffect } from 'react'
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
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config'
import { useRouter } from 'next/router'
import userRoles from '../constants/userRoles';
import { Purchases } from '../interfaces';
import PurchaseItem from '../components/PurchaseItem';
import Layout from '../components/Layout';
import Footer from '../components/Footer';


export default function Points({user, purchases, onStore} : any) {
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier');
		} else if(userRoles.Admin == user.userRole){
			router.replace('/home-admin');
		}
	}, [user, onStore]);
  return (
    <>
		<Layout authentication={user} onStore={onStore} title="Purchase History">
				<Box w="100%" h="100%" bg="#36B290">
					<Center>
						<VStack spacing="0">
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }} color="white">
								PURCHASE HISTORY
							</Text>
							{purchases?.purchases.length > 0 ? <Table>
								<Thead>
									<Tr>
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
							</Table>: 
							<Text>
								No Purchases Found. Scan Items Now!
							</Text>
							}
						</VStack>
					</Center>
				</Box>	
		</Layout>
		<Footer />
    </>
  );
}


Points.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
  const purchaseHistory = await frontEndAuthentication(`${server}/api/purchaseHistory/${user.id}`, ctx);
	const purchases: Purchases[] = purchaseHistory.purchases;
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user.id}`, ctx);
	return { user, purchases, onStore }
}