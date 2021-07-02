import {
	Spinner,
	HStack,
	Center,
	Stack
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect, useState } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { useQuery } from 'react-query';
import { ProductType } from '../interfaces';
import Product from '../components/Product'

export default function AuthIndexPage({ user, onStore } : any) {
	const [productTypeQuery, setProductTypeQuery] = useState("");
	
	const fetchProducts = async () => {
		if(productTypeQuery != ""){
			const res = await fetch(`api/products/getProductByType/${productTypeQuery}`);
			return res.json();
		}	
	}
	const { data: products, refetch, isFetching } = useQuery<ProductType[]>("products", fetchProducts);
	
	useEffect(() => {
		refetch();
	}, [productTypeQuery]);

	const router = useRouter();
	useEffect(() => {
		if(onStore){
			router.replace('/store');
		} else if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier');
		} else if(userRoles.Admin == user.userRole){
			router.replace('/home-admin');
		}
	}, [user, onStore]);
  return (
    <>
			<Layout authentication={user} onStore={false}>
			<Stack direction="row" spacing="5%">
			<Sidebar setQuery={setProductTypeQuery}/>
				<HStack width={"100%"}>
					{!isFetching && products && products.map((product) => {
						return <Product product={product} customerId={user.id} key={product._id}/>
					})}
					{isFetching && (<Center width="100%"><Spinner size="xl"/></Center>)}
				</HStack>
			</Stack>
			</Layout>
    </>
  );
}

AuthIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}