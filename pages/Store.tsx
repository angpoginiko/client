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
import { MdCenterFocusStrong } from 'react-icons/md';
import { useState } from 'react';

export default function AuthIndexPage({ user } : any) {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const [frontPageClicker, setFrontPageClicker] = useState(false);
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin')
		}
	}, [user]);

	const onModalClose = () => {
		setFrontPageClicker(false);
		onClose();
	}
  return (
    <>
			<Layout authentication={user} isModalOpen={isOpen} onModalClose={onModalClose} frontPageClick={frontPageClicker}>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
					<Center>
					<Box as='button'>
          	<Icon onClick={()=> {onOpen(), setFrontPageClicker(true)}} as={MdCenterFocusStrong} boxSize="350px"/>
					</Box>
					</Center>
					<Heading
            fontWeight={600}
            fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
            lineHeight={'110%'}>
            Start Scanning <br />
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
	return {user: json};
}