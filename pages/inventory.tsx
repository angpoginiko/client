import React, { useEffect } from 'react'
import {
  Text,
  VStack,
	Tabs, 
	TabList, 
	TabPanels, 
	Tab, 
	TabPanel
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config'
import { useRouter } from 'next/router'
import userRoles from '../constants/userRoles';
import AdminNavBar from '../components/AdminNavBar';
import Receiving from '../components/Receiving';
import ListOfProducts from '../components/ListOfProducts';
import { useQuery } from 'react-query';
import { ProductType, ReceivedProducts } from '../interfaces';


export default function Inventory({user, onStore} : any) {
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier')
		} else if((userRoles.Customer == user.userRole) && !onStore){
			router.replace('/home')
		} else if((userRoles.Customer == user.userRole) && onStore){
			router.replace('/store')
		}
	}, [user, onStore]);

	const fetchProducts = async () => {
		const res = await fetch("api/products/getProducts");
		return res.json();
	}
	const { data: products, refetch: refetchProducts } = useQuery<ProductType[]>("product", fetchProducts);
	
	const fetchReceivedProducts = async () => {
		const res = await fetch("api/receivingProducts/getReceivingProducts");
		return res.json();
	}
	const { data: receivingProducts, refetch: refetchReceiving } = useQuery<ReceivedProducts[]>("receivingProducts", fetchReceivedProducts);
  return (
    <>
		<AdminNavBar authentication={user} title="Inventory">
					<VStack>
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>
								INVENTORY
							</Text>
							<Tabs>
								<TabList>
									<Tab>Product List</Tab>
									<Tab>Receiving</Tab>
									<Tab>Stock</Tab>
									<Tab>Display</Tab>
								</TabList>

								<TabPanels>
									<TabPanel>
										<ListOfProducts products={products} refetchReceiving={refetchReceiving} refetchProducts={refetchProducts}/>
									</TabPanel>
									<TabPanel>
										<Receiving receivingProducts={receivingProducts}/>
									</TabPanel>
									<TabPanel>
										<p>two!</p>
									</TabPanel>
									<TabPanel>
										<p>three!</p>
									</TabPanel>
								</TabPanels>
							</Tabs>
					</VStack>
		</AdminNavBar>
    </>
  );
}


Inventory.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user!.id}`, ctx);
	return { user, onStore}
}