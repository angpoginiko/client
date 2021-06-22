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
import { UserCart, CartProductType } from '../interfaces';
import { useEffect, useState } from 'react';
import ModalComp from '../components/ModalComp';
import CheckoutItems from '../components/CheckoutItems'
import { useRouter } from 'next/router';
import userRoles from '../constants/userRoles';



export default function Cart({user, profile, onStore} : any) {
	const [checkoutItems, setCheckoutItems] = useState<UserCart[]>([])
	const [hasItems, setHasItems] = useState(false);
	const [orderId, setOrderId] = useState('');
	const [total, setTotal] = useState(0);
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {onOpen: checkoutOpen, isOpen: isCheckoutOpen, onClose: checkoutClose} = useDisclosure();
	const fetchCart = async () => {
		const res = await fetch(`api/cart/${user.id}`);
		return res.json();
	}
	const isProfileComplete = Boolean(profile?.email && profile.gender 	&& profile.mobilenumber && profile.tin && profile.address);
	
	const { data: cart, refetch } = useQuery<UserCart[]>("product", fetchCart);
	const handleDelete = async (productId: string | undefined) => {
    if (productId){
				await fetch (`/api/cart/${user.id}`, {
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

	const onCheckout = async (checkoutItems : UserCart[]) => {
		const productArray:CartProductType[] = [];
		checkoutItems.map((checkoutItem) => {
			productArray.push(checkoutItem.product);
		});
		const response = await fetch("/api/orders/addOrders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({id: user.id, items: productArray, total}),
		});
		const orderId = await response.json();
		setOrderId(orderId);
	}
	useEffect(() => {
		checkoutItems.length > 0 ? setHasItems(true) : setHasItems(false);
		refetch();
	}, [cart, checkoutItems]);

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
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
			<Layout authentication={user} onStore>
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
										<div key={userCart.product.productId?.toString()}>
											<CartProduct 
												userCart={userCart} 
												modalOpen={onOpen} 
												checkoutProduct={checkoutItems} 
												setCheckoutProduct={(product: UserCart[]) => setCheckoutItems(product)}
												refresh={refetch}
												setTotalPrice={setTotal}
												totalPrice={total}
											/>
											<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
												<Flex>
													<Text>
														Are you sure you want to remove this item?
													</Text>
													<HStack>
														<Button onClick={()=> handleDelete(userCart.product.productId?.toString())}>
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
						<Text>
							Total Price: {total}
						</Text>
						<Button disabled={hasItems ? false : true} onClick={() => {
							onCheckout(checkoutItems),
							checkoutOpen()
						}}>
							Checkout
						</Button>
						<ModalComp
						 isModalOpen={isCheckoutOpen}
						  onModalClose={() => {
							checkoutClose()}} 
							title="Checkout Items?">

							<CheckoutItems
							customerId={user.id}
							cart={checkoutItems} 
							orderId={orderId} 
							totalPrice={total} 
							isProfileComplete={isProfileComplete}
							/>

						</ModalComp>
					</Center>
				</VStack>
			</Layout>
    </>
  );
}

Cart.getInitialProps = async (ctx: NextPageContext) => {
  const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const profile = await frontEndAuthentication(`${server}/api/profile/GetUser`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user!.id}`, ctx);
	return {user, profile, onStore};
}