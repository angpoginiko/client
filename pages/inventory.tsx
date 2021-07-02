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


export default function Inventory({user, onStore} : any) {const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier')
		} else if((userRoles.Customer == user.userRole) && !onStore){
			router.replace('/home')
		} else if((userRoles.Customer == user.userRole) && onStore){
			router.replace('/store')
		}
	}, [user, onStore]);
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
										<ListOfProducts/>
									</TabPanel>
									<TabPanel>
										<Receiving />
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