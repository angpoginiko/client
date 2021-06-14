import Layout from '../components/Layout'
import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
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
import AddAdmin from '../components/AddAdmin';
import SetPointVariable from '../components/SetPointVariable';

export default function AdminIndexPage({ user } : any) {
	const {isOpen: isCashierOpen, onOpen: onCashierOpen, onClose: onCashierClose} = useDisclosure();
	const {isOpen: isAdminOpen, onOpen: onAdminOpen, onClose: onAdminClose} = useDisclosure();
	const {isOpen: isPointsOpen, onOpen: onPointsOpen, onClose: onPointsClose} = useDisclosure();
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
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onAdminOpen}>
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Admin</Text></Center>
								</Box>
							</Container>

							<Container>
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onCashierOpen}>
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Cashier</Text></Center>
								</Box>
							</Container>

							<Container>
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onPointsOpen}>
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Set Points Variable</Text></Center>
								</Box>
							</Container>

							<Container>
								<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={()=> router.push('/Inventory')}>
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Inventory</Text></Center>
								</Box>
							</Container>
						</SimpleGrid>
					</Center>
				</Box>
        </Stack>
      </Container>
			<ModalComp isModalOpen={isAdminOpen} onModalClose={onAdminClose} title="Add Admin">
				<AddAdmin modalClose={onAdminClose}/>
			</ModalComp>
			<ModalComp isModalOpen={isCashierOpen} onModalClose={onCashierClose} title="Add Cashier">
				<AddCashier modalClose={onCashierClose}/>
			</ModalComp>
			<ModalComp isModalOpen={isPointsOpen} onModalClose={onPointsClose} title="Set Point Variable">
				<SetPointVariable onModalClose={onPointsClose}/>
			</ModalComp>
		</AdminNavBar>
    </>
  );
}

AdminIndexPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return {user: json};
}