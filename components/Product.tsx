import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
	Button,
	Icon,
	useDisclosure, 
} from '@chakra-ui/react';
import { CartProductType, ProductType } from '../interfaces';
import { MdAddBox,  MdRemove} from "react-icons/md";
import React, { useState } from 'react';
import ModalComp from './ModalComp';

const IMAGE =
'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';


interface ProductProps {
	product: ProductType | undefined
	closeProduct: () => void
	customerId: string | undefined
}


export default function ProductPage({product, closeProduct, customerId} : ProductProps) {
	const [quantity, setQuantity] = useState(1);
	const { onOpen, isOpen, onClose } = useDisclosure();

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

	const addProduct = async (product: CartProductType) => {
		const response = await fetch (`/api/cart/${customerId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify(product),
		})
		await response.json();
		onOpen();
	}
  return (
		<>
			<Center py={12}>
				<Box
					role={'group'}
					p={6}
					maxW={'330px'}
					w={'full'}
					bg={useColorModeValue('white', 'gray.800')}
					boxShadow={'2xl'}
					rounded={'lg'}
					pos={'relative'}
					zIndex={1}>
					<Box
						rounded={'lg'}
						mt={-12}
						pos={'relative'}
						height={'230px'}
						_after={{
							transition: 'all .3s ease',
							content: '""',
							w: 'full',
							h: 'full',
							pos: 'absolute',
							top: 5,
							left: 0,
							backgroundImage: `url(${IMAGE})`,
							filter: 'blur(15px)',
							zIndex: -1,
						}}
						_groupHover={{
							_after: {
								filter: 'blur(20px)',
							},
						}}>
						<Image
							rounded={'lg'}
							height={230}
							width={282}
							objectFit={'cover'}
							src={IMAGE}
						/>
					</Box>
						<Stack pt={10} align={'center'}>
							<Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
								{product?.productType}
							</Text>
							<Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
								{product?.productName}
							</Heading>
							<Stack direction={'row'} align={'center'}>
								<Text fontWeight={800} fontSize={'xl'}>
									${product?.unitPrice! * quantity}
								</Text>
								<Text color={'gray.600'}>
								<Button onClick={() => increamentQuantity()}><Icon as={MdAddBox}/></Button>
								{quantity}
								<Button onClick={() => decrementQuantity()}><Icon as={MdRemove}/></Button>
									{`${product?.quantity} remaining`}
								</Text>
							</Stack>
							<Stack>
								<Button onClick={()=>{
									addProduct({
										productId: product?._id,
										quantity: quantity,
									})
								}}>
									ADD
								</Button>
							</Stack>
						</Stack>
				</Box>
			</Center>
			<ModalComp title="" isModalOpen={isOpen} onModalClose={() => {onClose(); closeProduct();}}>
				<Text>Item Added!</Text>
			</ModalComp>
		</>
  );
}