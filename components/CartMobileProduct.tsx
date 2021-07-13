import {
  Box,
  Text,
	Image,
	HStack,
	VStack,
	Icon,
	Center,
	Checkbox,
	useColorModeValue,
} from '@chakra-ui/react';
import { MdAddBox, MdRemove, MdDelete } from 'react-icons/md';
import { ChangeEvent, useEffect, useState } from 'react';
import { CartProductType, UserCart } from '../interfaces';

interface CartMobileProductProps{
	userCart: UserCart
	modalOpen: () => void;
	checkoutItems: CartProductType[];
	setCheckoutItems: (checkoutItems: CartProductType[]) => void;
	totalPrice: number;
	setTotalPrice: (totalPrice: number) => void;
}

export default function CartMobileProduct (
	{ userCart, 
		modalOpen,
		checkoutItems,
		setCheckoutItems,  
		totalPrice,
		setTotalPrice
	} : CartMobileProductProps) {
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
			<Box
					role={'group'}
					p={6}
					boxSize="50%"
					maxBlockSize="50%"
					minHeight="250px"
					bg={useColorModeValue('white', 'gray.800')}
					boxShadow={'2xl'}
					rounded={'lg'}
					pos={'relative'}
					h="250px"
					bgGradient="linear(to-r, #374D76, #D7A462)"
				>
					
					<VStack justify="center" align="center">
						<Image
							src={userCart.productData.image?.toString()}
							boxSize="70%"
						/>
						<HStack spacing="3" align="center">
						<Text fontSize="13" color="white">
							Add to Cart
						</Text>
						<Checkbox size="sm" name={userCart.product.productId?.toString()} checked={isAdded} onChange={handleChange}></Checkbox> 
					</HStack>
					<Box/>
					</VStack>
					<VStack justify="center" align="center">
						<Text color="white" fontSize={12} align="center">
							{userCart.productData.productName}, Price: Php {userCart.productData.unitPrice} / {userCart.productData.unitOfMeasure?.name}
						</Text>
					</VStack>
					<Center>

							<HStack 
								spacing={0}
								justify="center"
								align="center"
								width="20"
							>

							<Center>
								<Box 
									as="button" 
									onClick={() => decrementQuantity()} 
									disabled={isAdded}
								>
									<Center>
										<Icon as={MdRemove} boxSize="" color="white"/>
									</Center>
								</Box>
							</Center>

							<Center>
								<Box 
									width="8"
								>
									<Center>
										<Text 
											fontSize="xs"
											color="white"
										>
											{parseFloat(quantity.toString()).toFixed(2)}
										</Text>
									</Center>
								</Box>
							</Center>

							<Center>
								<Box 
									as="button" 
									onClick={() => increamentQuantity()} 
									disabled={isAdded}
								>
									<Center>
										<Icon as={MdAddBox} boxSize="4" color="white"/>
									</Center>
								</Box>
							</Center>
						</HStack>
					</Center>

					<Center>
					<Box 
						as="button" 
						onClick={() => modalOpen()} 
						boxSize="5"
					>
						<Icon 
							boxSize="5"
							as={MdDelete}
							color="white"
						/>
					</Box>
				</Center>
				<Center>
					<HStack spacing="3" align="center" mt="3px">
						<Text fontSize="13" color="white">
							Add container
						</Text>
						<Checkbox size="sm" name={`${userCart.product.productId}hasContainer`} isDisabled={isAdded} checked={userCart.product.hasContainer} onChange={handleHasContainer}></Checkbox>
					</HStack>
				</Center>
				</Box>
		</>
	);
}