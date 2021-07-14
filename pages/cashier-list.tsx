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
import { EditType } from '../interfaces';
import { useQuery } from 'react-query';
import Footer from '../components/Footer';
import EditItem from '../components/EditItem';
import AdminNavBar from '../components/AdminNavBar';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';


export default function CashierList({ user,onStore } : any) {
	const fetchCashier = async () => {
		const res = await fetch(`api/profile/getCashiers`);
		return res.json();
	}
	const { data: cashierList } = useQuery<EditType[]>("cashierList", fetchCashier);

	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier')
		} else if((userRoles.Customer == user.userRole) && onStore){
			router.replace('/store')
		} else if((userRoles.Customer == user.userRole) && !onStore){
			router.replace('/home')
		}
	}, [user, onStore]);
  return (
    <>
		<AdminNavBar>
			<Box w="100%" h="100%" bg="#36B290">
				<Center>
					<VStack spacing="0">
						{cashierList?.length! > 0 ? 
						<Table variant="unstyled">
							<Thead>
								<Tr>
									<Th>Cashier Name:</Th>
								</Tr>
							</Thead>
							<Tbody>
								{cashierList && cashierList.map((items) => {
									return(
											<EditItem item={items} key={items._id}/>
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
		</AdminNavBar>
		<Footer />
    </>
  );
}


CashierList.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx)
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user.id}`, ctx);
	return { user,onStore }
}