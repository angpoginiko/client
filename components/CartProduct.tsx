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
import { CartProductType, UserCart } from '../interfaces';

interface CartProductProps{
	userCart: UserCart
	modalOpen: () => void;
	checkoutItems: CartProductType[];
	setCheckoutItems: (checkoutItems: CartProductType[]) => void;
	totalPrice: number;
	setTotalPrice: (totalPrice: number) => void;
}

export default function CartProduct (
	{ userCart, 
		modalOpen,
		checkoutItems,
		setCheckoutItems,  
		totalPrice,
		setTotalPrice
	} : CartProductProps) {
	const [quantity, setQuantity] = useState(userCart.product.quantity);
	const [isAdded, setIsAdded] = useState(false);
	const [hasContainer, setHasContainer] = useState(false);
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
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if(e.target.name === userCart.product.productId?.toString()){
			setIsAdded(e.target.checked);
			if(!isAdded){
				let newProduct: CartProductType = {
					isAdded: !isAdded,
					productId: userCart.product.productId.toString(),
					quantity,
					hasContainer,
					image: userCart.productData.image!,
					productName: userCart.productData.productName?.toString(),
					unitPrice: userCart.productData.unitPrice!
				};
				console.log(newProduct.isAdded)
				checkoutItems.push(newProduct);
				setCheckoutItems(checkoutItems);
				totalPrice += (userCart.productData.unitPrice! * quantity);
				setTotalPrice(totalPrice);
			} else {
					const index = checkoutItems.map((e) => {
						return e.productId;
					}).indexOf(userCart.product.productId);
					
					if (index > -1) {
						checkoutItems.splice(index, 1);
					}
					totalPrice -= (userCart.productData.unitPrice! * quantity);
					setTotalPrice(totalPrice);
			}
		}
	}
	const handleHasContainer = (e: ChangeEvent<HTMLInputElement>) => {
		if(e.target.name === `${userCart.product.productId}hasContainer`){
			setHasContainer(!hasContainer);
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
				<Checkbox name={userCart.product.productId?.toString()} checked={isAdded} onChange={handleChange}></Checkbox>
			</Center>

			<HStack borderRight="1px" height={{base: 75, sm: 90, md: 100, lg: 180}} width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}}>
				<Box width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}} color="white">
					<Center>
						<Image boxSize={{sm: 70, md: 90, lg: 120}} src={userCart.productData.image?.toString()} />
					</Center>
				</Box>

				<VStack width={{base: 97.5, sm: 175.5, md: 234, lg: 312, xl: 440}}>
					<Text color="white" fontSize={{base: 10, sm: 15, lg: 30}}>
						{userCart.productData.productName}
					</Text>

					<Text color="white" fontSize={{base: 5, sm: 10, md: 13, lg: 16}}>
						Price: Php {userCart.productData.unitPrice} / Kg
					</Text>
				</VStack>
			</HStack>
			
			<HStack height={{base: 75, sm: 90, md: 100, lg: 180}} borderRight="1px" width={{base: 100.5, sm: 211.5, md: 282, lg: 376, xl: 530}}>
				<Box color="white">
					<Text fontSize={{base: 7, sm: 12, md: 15, lg: 18}}>
						Description:
					</Text>	
					<Text fontSize={{base: 4, sm: 8, md: 11, lg: 14}}> 
						 {userCart.productData.productDesc}
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
									{parseFloat(quantity.toString()).toFixed(2)}
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

			<Center borderLeft="1px" height={{base: 75, sm: 90, md: 100, lg: 180}} width={{sm: 70, md: 90, lg: 120}}>
				<HStack>
					<Text>
						Add container
					</Text>
					<Checkbox name={`${userCart.product.productId}hasContainer`} isDisabled={isAdded} checked={userCart.product.hasContainer} onChange={handleHasContainer}></Checkbox>
				</HStack>
			</Center>
			<Box></Box>
		</HStack>
		</>
	);
}