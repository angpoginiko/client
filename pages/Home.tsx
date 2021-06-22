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
import Layout from '../components/Layout';

export default function AuthIndexPage({ user, onStore } : any) {
	const router = useRouter();
	useEffect(() => {
		if(onStore){
			router.replace('/store');
		} else if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier');
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin');
		}
	}, [user, onStore]);
  return (
    <>
			<Layout authentication={user} onStore={false}>
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
		</Layout>
    </>
  );
}

AuthIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}