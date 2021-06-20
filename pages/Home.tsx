import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
	Center
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';
import MainHeader from '../components/MainHeader';

export default function AuthIndexPage({ user, onStore } : any) {
	const router = useRouter();
	useEffect(() => {
		if(onStore){
			router.replace('/Store');
		} else if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier');
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin');
		}
	}, [user, onStore]);

  return (
    <>
			<MainHeader authentication={user}>
				<Container maxW={'3xl'}>
					<Stack
						as={Box}
						textAlign={'center'}
						spacing={{ base: 8, md: 14 }}
						py={{ base: 20, md: 36 }}>
						<Center>
						</Center>
						<Heading
							fontWeight={600}
							fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
							lineHeight={'110%'}>
							Online <br />
							<Text as={'span'} color={'green.400'}>
							</Text>
						</Heading>
						<Stack
							direction={'column'}
							spacing={3}
							align={'center'}
							alignSelf={'center'}
							position={'relative'}>
						</Stack>
					</Stack>
				</Container>
		</MainHeader>
    </>
  );
}

AuthIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/getOnStore`, ctx);
	return {user: json, onStore};
}