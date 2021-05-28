import Layout from '../components/Layout'
import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
	Icon,
	Center,
	useDisclosure
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';

export default function ProfilePage({ user, profile } : any) {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin')
		}
	}, [user]);
  return (
    <>
			<Layout authentication={user} isModalOpen={isOpen} onModalClose={onClose}>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
						<Box>
							<Box>
								Name: {profile.name} 
							</Box>

							<Box>
								Username: {profile.username}							
							</Box> 

							<Box>
								Email: {profile.email}
							</Box>

							<Box>
								Address: {profile.address || "N/A"}
							</Box>

							<Box>
								Gender: {profile.gender || "N/A"}
							</Box>

							<Box>
								Mobile Number: {profile.mobileNumber || "N/A"}
							</Box>

							<Box>
								TIN: {profile.tin || "N/A"}
							</Box>
						</Box>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
          </Stack>
        </Stack>
      </Container>
		</Layout>
    </>
  );
}

ProfilePage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const profile = await frontEndAuthentication(`${server}/api/profile/GetUser`, ctx);
	return {user: json, profile};
}