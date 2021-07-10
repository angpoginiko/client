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
import Storage from '../components/Storage';
import Display from '../components/Display';
import ListOfProducts from '../components/ListOfProducts';
import { useQuery } from 'react-query';
import { ProductType, ReceivedProducts, StorageDisplayProductType } from '../interfaces';
import Footer from '../components/Footer';

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
	const { data: products, refetch: refetchProducts, isFetching } = useQuery<ProductType[]>("product", fetchProducts);
	
	const fetchReceivedProducts = async () => {
		const res = await fetch("api/receivingProducts/getReceivingProducts");
		return res.json();
	}
	const { data: receivingProducts, refetch: refetchReceiving, isFetching: isReceivingFetching } = useQuery<ReceivedProducts[]>("receivingProducts", fetchReceivedProducts);

	const fetchStockProducts = async () => {
		const res = await fetch("api/stock/getStockProducts");
		return res.json();
	}
	const { data: stockProducts, refetch: refetchStockProducts, isFetching: isStockFetching } = useQuery<StorageDisplayProductType[]>("stockProducts", fetchStockProducts);

	const fetchDisplayProducts = async () => {
		const res = await fetch("api/display/getDisplayProducts");
		return res.json();
	}
	const { data: displayProducts, refetch: refetchDisplayProducts, isFetching: isDisplayRefetching } = useQuery<StorageDisplayProductType[]>("displayProducts", fetchDisplayProducts);
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
										<Tab>Storage</Tab>
										<Tab>Display</Tab>
									</TabList>

									<TabPanels>
										<TabPanel>
											<ListOfProducts 
												products={products} 
												refetchReceiving={refetchReceiving} 
												refetchProducts={()=>{refetchDisplayProducts(), refetchStockProducts(), refetchProducts()}} 
												isFetching={isFetching}
											/>
										</TabPanel>
										<TabPanel>
											<Receiving 
												receivingProducts={receivingProducts} 
												refetch={() => {refetchStockProducts(), refetchReceiving()}}
												isReceivingFetching={isReceivingFetching}
											/>
										</TabPanel>
										<TabPanel>
											<Storage 
												storageProducts={stockProducts} 
												refetch={() => {refetchDisplayProducts(), refetchStockProducts()}}
												isStockFetching={isStockFetching}
											/>
										</TabPanel>
										<TabPanel>
											<Display 
												displayProducts={displayProducts} 
												refetch={refetchDisplayProducts}
												isDisplayRefetching={isDisplayRefetching}
											/>
										</TabPanel>
									</TabPanels>
								</Tabs>
						</VStack>
			</AdminNavBar>
			<Footer />
    </>
  );
}


Inventory.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user!.id}`, ctx);
	return { user, onStore}
}