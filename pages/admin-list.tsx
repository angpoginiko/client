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
import { useRouter } from 'next/router';
import userRoles from '../constants/userRoles';


export default function AdminList({ user, onStore } : any) {
	const fetchAdmins = async () => {
		const res = await fetch(`api/profile/getAdmins`);
		return res.json();
	}
	const { data: adminList } = useQuery<EditType[]>("cashierList", fetchAdmins);

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
						{adminList?.length! > 0 ? 
						<Table variant="unstyled">
							<Thead>
								<Tr>
									<Th>Admin Name:</Th>
								</Tr>
							</Thead>
							<Tbody>
								{adminList && adminList.map((items) => {
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


AdminList.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user.id}`, ctx);
	return { user, onStore }
}