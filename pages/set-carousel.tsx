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
import AddCarouselImage1 from '../components/AddCarouselImage1';
import AddCarouselImage2 from '../components/AddCarouselImage2';
import AddCarouselImage3 from '../components/AddCarouselImage3';
import Footer from '../components/Footer';

export default function HomeAdminPage({ user, onStore } : any) {
	const {isOpen: isAddOpen1, onOpen: onAddOpen1, onClose: onAddClose1} = useDisclosure();
	const {isOpen: isAddOpen2, onOpen: onAddOpen2, onClose: onAddClose2} = useDisclosure();
	const {isOpen: isAddOpen3, onOpen: onAddOpen3, onClose: onAddClose3} = useDisclosure();
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
			<AdminNavBar title="Set Carousel">
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
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onAddOpen1}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Image 1</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onAddOpen2}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Image 2</Text></Center>
									</Box>
								</Container>

								<Container>
									<Box w="120%" h="98px" borderRadius="3xl" border="1px" as="button" onClick={onAddOpen3}>
										<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>Add Image 3</Text></Center>
									</Box>
								</Container>
								
							</SimpleGrid>
						</Center>
					</Box>
					</Stack>
				</Container>
				<ModalComp isModalOpen={isAddOpen1} onModalClose={onAddClose1} title="Add Admin">
					<AddCarouselImage1 modalClose={onAddClose1}/>
				</ModalComp>
				<ModalComp isModalOpen={isAddOpen2} onModalClose={onAddClose2} title="Add Cashier">
					<AddCarouselImage2 modalClose={onAddClose2}/>
				</ModalComp>
				<ModalComp isModalOpen={isAddOpen3} onModalClose={onAddClose3} title="Set Point Variable">
					<AddCarouselImage3 modalClose={onAddClose3}/>
				</ModalComp>
		</AdminNavBar>
		<Footer />
    </>
  );
}

HomeAdminPage.getInitialProps = async (ctx: NextPageContext) => {
  const json = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${json!.id}`, ctx);
	return {user: json, onStore};
}