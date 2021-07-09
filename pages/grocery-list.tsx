import Layout from '../components/Layout'
import {
  Box,
  Text,
  VStack,
	Center
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useQuery } from 'react-query';
import { UserList } from '../interfaces';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import userRoles from '../constants/userRoles';
import GrocercyProduct from '../components/GroceryProduct';
import Footer from '../components/Footer';



export default function GroceryList({user, onStore} : any) {
	const fetchList = async () => {
		const res = await fetch(`api/list/lists/${user.id}`);
		return res.json();
	}
	
	const { data: list, refetch } = useQuery<UserList[]>("list", fetchList);

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
			<Layout authentication={user} onStore={onStore} title="Grocery List">
				<VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
					<Box w="100%" h={{ base: "100px", md: "150px", lg: "200px" }}>
						<Center>
							<VStack spacing="0">
								<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>
									Grocery List
								</Text>
							</VStack>
						</Center>
					</Box>
					
					<Center>
						<VStack w="100%" h="800px">
							{list?.length ? list.map((userList) => {
								return(
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									);
							}):
								(<Text key={user}>
									You have no item on your List
								</Text>
									)
							}
						</VStack>
					</Center>
				</VStack>
			</Layout>
			<Footer />
    </>
  );
}

GroceryList.getInitialProps = async (ctx: NextPageContext) => {
  const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user!.id}`, ctx);
	return {user, onStore};
}