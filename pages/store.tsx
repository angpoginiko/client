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
import Footer from '../components/Footer';

export default function AuthIndexPage({ user, onStore} : any) {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const [frontPageClicker, setFrontPageClicker] = useState(false);
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/home-admin')
		} else if(!onStore){
			router.replace('./home');
		}
	}, [user, onStore]);

	const onModalClose = () => {
		setFrontPageClicker(false);
		onClose();
	}
  return (
    <>
			<Layout authentication={user} isModalOpen={isOpen} onModalClose={onModalClose} frontPageClick={frontPageClicker} onStore title="Store">
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
		<Footer />
    </>
  );
}

AuthIndexPage.getInitialProps = async (ctx: NextPageContext) => {
	const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}