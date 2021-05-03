import {
  Box,
  Text,
  VStack,
	Center,
	Button
} from '@chakra-ui/react';
import { useState } from 'react';
import { UserCart } from '../interfaces';
import CheckoutItem from './CheckoutItem'
import QRGenerator from './QRGenerator'

interface CheckoutProductProps {
	cart : UserCart[];
	orderId: string;
	totalPrice: number;
}

export default function CheckoutProducts({cart, orderId, totalPrice} : CheckoutProductProps) {
	const [isCreated, setIsCreated] = useState(true);
  return (
    <>
				<VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
					{isCreated && 
					(
					<>
							<Box></Box>
							<Center>
								<VStack w="100%" h="100%">
									{cart?.length ? cart.map((userCart) => {
										return(
												<div key={userCart.product.productId}>
														<CheckoutItem userCart={userCart}/>
												</div>
											);
									}):
										(<Text>
											You have no item on your Checkout
										</Text>
											)
									}
								</VStack>
							</Center>
						</>)
					}
					<Center boxSize="100%">
						<VStack>
							<Text>Total: {totalPrice}</Text>
							<QRGenerator text={orderId} buttonName="Generate Checkout QR" isCreated={isCreated} setIsCreated={setIsCreated}/>
						</VStack>
					</Center>
				</VStack>
    </>
  );
}