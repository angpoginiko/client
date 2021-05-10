import Layout from '../components/Layout'
import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
	Center,
	SimpleGrid,
	useDisclosure
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import userRoles from '../constants/userRoles';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminNavBar from '../components/AdminNavBar';
import ModalComp from '../components/ModalComp';
import AddCashier from '../components/AddCashier';

export default function AdminIndexPage({ user } : any) {
	const {isOpen: isCashierOpen, onOpen: onCashierOpen, onClose: onCashierClose} = useDisclosure();
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Customer == user.userRole){
			router.replace('/Home')
		}
	}, []);
  return (
    <>
			<AdminNavBar>
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
            Admin <br />
            <Text as={'span'} color={'green.400'}>
            </Text>
          </Heading>
					<Box w="100%" h="800px">
					<Center>
						<SimpleGrid gap="20px">
							<Container>
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onCashierOpen}>
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Cashier</Text></Center>
								</Box>
							</Container>

							<Container>
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button">
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Inventory</Text></Center>
								</Box>
							</Container>
						</SimpleGrid>
					</Center>
				</Box>
        </Stack>
      </Container>
			<ModalComp isModalOpen={isCashierOpen} onModalClose={onCashierClose} title="Add Cashier">
				<AddCashier modalClose={onCashierClose}/>
			</ModalComp>
		</AdminNavBar>
    </>
  );
}

AdminIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return {user: json};
}