import Layout from '../components/Layout'
import Head from 'next/head';
import {
  Box,
  Text,
  VStack,
	Center,
	useDisclosure,
	Button,
	HStack,
	Flex
} from '@chakra-ui/react';
import CartProduct from '../components/CartProduct'
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config';
import { useQuery } from 'react-query';
import { UserCart } from '../interfaces';
import { useEffect } from 'react';
import ModalComp from '../components/ModalComp';



export default function Cart({user} : any) {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const fetchCart = async () => {
		const res = await fetch(`api/cart/${user}`);
		return res.json();
	}
	
	const { data: cart, refetch } = useQuery<UserCart[]>("product", fetchCart);
	const handleDelete = async (productId: string | undefined) => {
    if (productId){
				await fetch (`/api/cart/${user}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: 'include',
					body: JSON.stringify({productId}),
				})
				refetch();
				onClose();
    }
   }

	useEffect(() => {
		refetch();
	}, [cart])
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
			<Layout authentication={user}>
			<VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
				<Box w="100%" h={{ base: "100px", md: "150px", lg: "200px" }}>
					<Center>
						<VStack spacing="0">
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>
								My Cart
							</Text>
						</VStack>
					</Center>
				</Box>
				
				<Center>
					<VStack w="100%" h="800px">
						{cart?.length ? cart.map((userCart) => {
							return(
									<div key={userCart._id}>
											<CartProduct userCart={userCart} modalOpen={onOpen}/>
											<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
												<Flex>
													<Text>
														Are you sure you want to remove this item?
													</Text>
													<HStack>
														<Button onClick={()=> handleDelete(userCart.product.productId)}>
															Yes
														</Button>
														<Button onClick={() => onClose()}>
															No
														</Button>
													</HStack>
												</Flex>
										</ModalComp>
									</div>
								);
						}):
							(<Text key={user}>
								You have no item on your Cart
							</Text>
								)
						}
					</VStack>
					<Button>
						Checkout
					</Button>
				</Center>
			</VStack>
		</Layout>
    </>
  );
}

Cart.getInitialProps = async (ctx: NextPageContext) => {
  const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return {user};
}