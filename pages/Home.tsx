import Layout from '../components/Layout'
import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useEffect } from 'react';
import userRoles from '../constants/userRoles';
import { useRouter } from 'next/router';

export default function AuthIndexPage({ user } : any) {
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
			<Layout authentication={user}>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Welcome <br />
            <Text as={'span'} color={'green.400'}>
            </Text>
          </Heading>
          <Text color={'gray.500'}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis lorem sit amet lectus tristique, 
					venenatis varius nibh blandit. Fusce faucibus varius lorem. 
					Ut consequat, lacus eu ultricies suscipit, purus sem convallis purus, 
					et fringilla magna lectus in purus. 
					Morbi mollis tempor dolor, in interdum mauris pharetra sit amet. 
					Aliquam dictum viverra dui, in pellentesque urna dignissim quis. 
					Nam commodo venenatis suscipit. Vestibulum imperdiet lorem nec ex hendrerit dapibus. 
					Integer at nisl felis.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'green'}
              bg={'green.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'green.500',
              }}
							href="/login"
							>
              Get Started
            </Button>
          </Stack>
        </Stack>
      </Container>
		</Layout>
    </>
  );
}

AuthIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return {user: json};
}