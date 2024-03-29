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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminNavBar from '../components/AdminNavBar';
import ModalComp from '../components/ModalComp';
import AddCashier from '../components/AddCashier';
import AddAdmin from '../components/AddAdmin';
import SetPointVariable from '../components/SetPointVariable';
import Footer from '../components/Footer';
import SetSocialLinks from '../components/SetSocialLinks'
import PageLoader from '../components/PageLoader';

export default function HomeAdminPage({ user, onStore } : any) {
	const [isLoading, setIsLoading] = useState(false);
	const {isOpen: isCashierOpen, onOpen: onCashierOpen, onClose: onCashierClose} = useDisclosure();
	const {isOpen: isAdminOpen, onOpen: onAdminOpen, onClose: onAdminClose} = useDisclosure();
	const {isOpen: isPointsOpen, onOpen: onPointsOpen, onClose: onPointsClose} = useDisclosure();
	const {isOpen: isSocialsOpen, onOpen: onSocialsOpen, onClose: onSocialsClose} = useDisclosure();
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
				{!isLoading ? <Container maxW={'3xl'}>
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
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={()=> {router.push('/admin-list'), setIsLoading(true)}}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Edit Admin</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onCashierOpen}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Cashier</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={()=> {router.push('/cashier-list'), setIsLoading(true)}}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Edit Cashier</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onPointsOpen}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Set Points Variable</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={()=> {router.push('/inventory'), setIsLoading(true)}}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Inventory</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={()=> {router.push('/set-carousel'), setIsLoading(true)}}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Set Carousel Images</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onSocialsOpen}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Set Social Links</Text></Center>
									</Box>
								</Container>

							</SimpleGrid>
						</Center>
					</Box>
					</Stack>
				</Container> : <PageLoader size="xl"/>}
			<ModalComp isModalOpen={isAdminOpen} onModalClose={onAdminClose} title="Add Admin">
				<AddAdmin modalClose={onAdminClose}/>
			</ModalComp>
			<ModalComp isModalOpen={isCashierOpen} onModalClose={onCashierClose} title="Add Cashier">
				<AddCashier modalClose={onCashierClose}/>
			</ModalComp>
			<ModalComp isModalOpen={isPointsOpen} onModalClose={onPointsClose} title="Set Point Variable">
				<SetPointVariable onModalClose={onPointsClose}/>
			</ModalComp>
			<ModalComp isModalOpen={isSocialsOpen} onModalClose={onSocialsClose} title="">
				<SetSocialLinks modalClose={onSocialsClose}/>
			</ModalComp>
		</AdminNavBar>
		{!isLoading && <Footer />}
    </>
  );
}

HomeAdminPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}