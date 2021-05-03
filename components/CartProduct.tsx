import {
  Box,
  Text,
	Image,
	HStack,
	VStack,
	Icon,
	Center,
	Checkbox,
} from '@chakra-ui/react';
import { MdAddBox, MdRemove, MdDelete } from 'react-icons/md';
import { ChangeEvent, useEffect, useState } from 'react';
import { ProductType, UserCart } from '../interfaces';

interface CartProductProps{
	userCart: UserCart
	modalOpen: () => void;
	checkoutProduct: UserCart[];
	setCheckoutProduct: (product: UserCart[]) => void;
	refresh: () => void;
	totalPrice: number;
	setTotalPrice: (totalPrice: number) => void;
}

export default function CartProduct (
	{ userCart, 
		modalOpen, 
		checkoutProduct, 
		setCheckoutProduct, 
		refresh,
		totalPrice,
		setTotalPrice } : CartProductProps) {
	let { productName, unitPrice, productDesc  } : ProductType = {}
	const [quantity, setQuantity] = useState(userCart.product.quantity);
	const [isAdded, setIsAdded] = useState(false);
	const increamentQuantity = () => {
		setQuantity(prevQuantity => prevQuantity + 1);
	}

	const decrementQuantity = () => {
		if(quantity != 1) {
			setQuantity(prevQuantity => prevQuantity - 1);
		} else {
			setQuantity(1);
		}
	}
	userCart.productData.map((data) => {
		productName = data.productName
		unitPrice = data.unitPrice
		productDesc = data.productDesc
	});
	
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if(e.target.name === userCart.product.productId){
			setIsAdded(!isAdded)
			userCart.product.isAdded = e.target.checked;

			if(userCart.product.isAdded == true){
				checkoutProduct.push(userCart);
				setCheckoutProduct(checkoutProduct);
				
				totalPrice = totalPrice + (unitPrice! * quantity);
				setTotalPrice(totalPrice);
			}
			else if(userCart.product.isAdded == false){
				const index = checkoutProduct.map((e) => {
					return e.product.productId;
				}).indexOf(userCart.product.productId);
				
				if (index > -1) {
					checkoutProduct.splice(index, 1);
				}
				setCheckoutProduct(checkoutProduct);

				totalPrice = totalPrice - (unitPrice! * quantity);
				setTotalPrice(totalPrice);
			}
			refresh();
		}
	}

	useEffect(() => {
		userCart.product.quantity = quantity;
	}, [quantity]);
	return(
		<>
		<HStack 
			borderWidth="1px" 
			borderColor="black" 
			bgGradient="linear(to-r, #374D76, #D7A462)" 
			spacing={2} 
			borderRadius="3xl" 
			width="400"
		>
			
			<Center borderRight="1px" height={{base: 75, sm: 90, md: 100, lg: 180}} width={{sm: 70, md: 90, lg: 120}}>
				<Checkbox name={userCart.product.productId} checked={userCart.product.isAdded} onChange={handleChange}></Checkbox>
			</Center>

			<HStack borderRight="1px" height={{base: 75, sm: 90, md: 100, lg: 180}} width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}}>
				<Box width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}} color="white">
					<Center>
						<Image boxSize={{sm: 70, md: 90, lg: 120}} src="https://www.the-pasta-project.com/wp-content/uploads/2017/08/Fettuccine-640x433.jpg" />
					</Center>
				</Box>

				<VStack width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}}>
					<Text color="white" fontSize={{base: 10, sm: 15, md: 20, lg: 30}}>
						{productName}
					</Text>

					<Text color="white" fontSize={{base: 5, sm: 10, md: 13, lg: 16}}>
						Price: Php {unitPrice} / Kg
					</Text>
				</VStack>
			</HStack>
			
			<HStack height={{base: 75, sm: 90, md: 100, lg: 180}} borderRight="1px" width={{base: 100.5, sm: 211.5, md: 282, lg: 376, xl: 530}}>
				<Box color="white">
					<Text fontSize={{base: 7, sm: 12, md: 15, lg: 18}}>
						Description:
					</Text>	
					<Text fontSize={{base: 4, sm: 8, md: 11, lg: 14}}> 
						 {productDesc}
					</Text>
				</Box>
			</HStack>
			<VStack 
			width={{base: 35, sm: 63, md: 84, lg: 112, xl: 160}} 
			>
				<HStack 
				border={{base: '0', md: '1px'}} 
				borderRadius={{md: '2xl', lg: '3xl'}} 
				width={{ md: 84, lg: 112, xl: 160}} 
				spacing={0}>
					<Center>
						<Box 
						as="button" 
						width={{base: 12, sm: 21, md: 28, lg: 37, xl: 53}} 
						onClick={() => decrementQuantity()} 
						boxSize={{base: 3, sm: 4, md: 5, lg: 7}} 
						borderRight={{base: '0', md: '1px'}}
						disabled={isAdded}
						>
							<Center>
							<Icon as={MdRemove} boxSize={{base: 2, md: 3, lg: 6}}/>
							</Center>
						</Box>
					</Center>

					<Center  id="69">
						<Box 
						width={{base: 5, sm: 8, lg: 37, xl: 53}}
						>
							<Center>
								<Text 
								fontSize={{base: 'xs', sm: 'sm', lg: 'lg'}}
								>
									{quantity}
								</Text>
							</Center>
						</Box>
					</Center>

					<Center>
						<Box 
						as="button" 
						width={{base: 12, sm: 21, md: 28, lg: 37, xl: 53}} 
						onClick={() => increamentQuantity()} 
						boxSize={{base: 3, sm: 4, md: 5, lg: 7}} 
						borderLeft={{base: '0', md: '1px'}}
						disabled={isAdded}
						>
							<Center>
							<Icon as={MdAddBox} boxSize={{base: 2, md: 3, lg: 6}}/>
							</Center>
						</Box>
					</Center>
				</HStack>
				
				<Center>
					<Box 
					as="button" 
					onClick={() => modalOpen()} 
					boxSize={10}><Icon 
					boxSize={{base: 4, md: 5, lg: 6}} 
					as={MdDelete}/>
					</Box>
				</Center>	
			</VStack>
			<Box></Box>
		</HStack>
		</>
	);
}