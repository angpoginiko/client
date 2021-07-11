import Layout from '../components/Layout'
import {
  Box,
  Text,
  VStack,
	Center,
	Stack,
	Grid,
	SimpleGrid
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useQuery } from 'react-query';
import { UserList } from '../interfaces';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import userRoles from '../constants/userRoles';
import GrocercyProduct from '../components/GroceryProduct';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';



export default function GroceryList({user, onStore} : any) {
	const [isLoading, setIsLoading] = useState(false);
	const fetchList = async () => {
		const res = await fetch(`api/list/lists/${user.id}`);
		return res.json();
	}
	
	const { data: list, refetch, isFetching } = useQuery<UserList[]>("list", fetchList);

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
			<Layout authentication={user} onStore={onStore} title="Grocery List" setIsLoading={setIsLoading}>
				{!isLoading ? <VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
					<Box w="100%" h={{ base: "70px", md: "100px", lg: "120px" }}>
						<Center>
							<VStack spacing="0">
								<Text fontSize={{ base: "30px", md: "45px", lg: "65px" }}>
									Grocery List
								</Text>
							</VStack>
						</Center>
					</Box>
					
					<Center margin="0">
						<SimpleGrid w="100%" h="100%" paddingBottom="25%" gap={2} columns={{base: 1, md: 2}}>
							{!isFetching ? list?.length ? list.map((userList) => {
								return(
									<>
										<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									<GrocercyProduct 
										userList={userList} 
										user={user.id} 
										refetch={refetch}
										onStore={onStore}
										customerId={user.id}
										key={userList.product.quantity}
									/>
									</>
									);
							}):
								(<Text key={user}>
									You have no item on your List
								</Text>
									) :
								<PageLoader size="xl"/>
							}
						</SimpleGrid>
					</Center>
				</VStack> : <PageLoader size="xl"/>}
			</Layout>
			{!isLoading && <Footer />}
    </>
  );
}

GroceryList.getInitialProps = async (ctx: NextPageContext) => {
  const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user!.id}`, ctx);
	return {user, onStore};
}