import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
	SimpleGrid,
	Center,
	useDisclosure
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import CashierNavBar from '../components/CashierNavBar';
import ModalComp from '../components/ModalComp'
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import userRoles from '../constants/userRoles';
import Footer from '../components/Footer';

const OrderQRScanner = dynamic(() => import('../components/OrderQRScanner'), {
	ssr: false,
});

export default function CashierIndexPage({ user, onStore } : any) {
	const { onOpen: openOrder, isOpen: isOrderOpen, onClose: closeOrder } = useDisclosure();
	const router = useRouter();
	
	useEffect(() => {
		if(userRoles.Admin == user.userRole){
			router.replace('/home-admin')
		} else if((userRoles.Customer == user.userRole) && onStore){
			router.replace('/store')
		} else if((userRoles.Customer == user.userRole) && !onStore){
			router.replace('/home')
		}
	}, [user, onStore]);
  return (
    <>
			<CashierNavBar authentication={user}>
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
            Cashier <br />
            <Text as={'span'} color={'green.400'}>
            </Text>
          </Heading>
					<Box w="100%" h="800px">
					<Center>
						<SimpleGrid gap="20px">
							<Container>
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={openOrder}>
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Checkout</Text></Center>
								</Box>
							</Container>
						</SimpleGrid>
					</Center>
				</Box>
        </Stack>
      </Container>
		</CashierNavBar>
		<ModalComp isModalOpen={isOrderOpen} onModalClose={closeOrder} title="Scan Item"><OrderQRScanner/></ModalComp>
		<Footer />
    </>
  );
}

CashierIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}