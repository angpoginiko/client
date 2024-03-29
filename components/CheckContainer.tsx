import {
  Box,
  Text,
	Image,
	HStack,
	VStack,
	Center,
} from '@chakra-ui/react';
import { ProductType, UserCart } from '../interfaces';

interface CheckoutContainerProps{
	userCart: UserCart,
}

export default function CheckoutContainer ({ userCart } : CheckoutContainerProps) {
	let { productName, unitPrice, image  } : ProductType = {}
	
	return(
		<>
			<HStack 
				borderWidth="1px" 
				borderColor="black" 
				bgGradient="linear(to-r, #374D76, #D7A462)" 
				spacing={2} 
				borderRadius="3xl" 
				width="200"
			>

				<HStack borderRight="1px" height={{base: 75, sm: 90, md: 100}} width={{base: 97.5, sm: 175.5, md: 234, lg: 225.6}}>
					<Box width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}} color="white">
						<Center>
							<Image boxSize={{sm: 70, md: 90}} src={image?.toString()} />
						</Center>
					</Box>

					<VStack width={{base: 97.5, sm: 175.5, md: 234}}>
						<Text color="white" fontSize={{base: 10, sm: 15}}>
							{productName}
						</Text>

						<Text color="white" fontSize={{base: 9}}>
							Php {unitPrice! * userCart.product.quantity}
						</Text>
					</VStack>
				</HStack>


				<Center width={{base: 35, sm: 63, md: 84}} id="test">
					<Center border={{base: '0'}} spacing={0}>
						<Center>
							<HStack width={{base: 5}}>
								<Center><Text fontSize={{base: 'xs'}}>Qty: </Text></Center>
								<Center><Text fontSize={{base: 'xs'}}>{userCart.product.quantity}</Text></Center>
							</HStack>
						</Center>
					</Center>
				</Center>
				<Box>
				</Box>
			</HStack>
		</>
	);
}