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
	VStack
} from '@chakra-ui/react';
import { ProductType } from '../interfaces';
import { MdAddBox,  MdRemove} from "react-icons/md";
import React, { useState } from 'react';
import ModalComp from './ModalComp';
interface ProductProps {
	product: ProductType | undefined
	closeProduct?: () => void
	customerId: string | undefined
}

type FormValues = {
	productId: string;
	quantity: number;
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

	const addProduct = async (product: FormValues) => {
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
							backgroundImage: `url(${product?.image?.toString()})`,
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
							src={product?.image!.toString()}
						/>
					</Box>
						<Stack pt={10} align={'center'}>
							<Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
								{product?.productType?.name}
							</Text>
							<Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
								{product?.productName}, P{product?.unitPrice! * quantity}
							</Heading>
							<VStack align={'center'}>
								<Text color={'gray.600'}>
								<Button onClick={() => increamentQuantity()} variant="ghost"><Icon as={MdAddBox}/></Button>
									{quantity}
								<Button onClick={() => decrementQuantity()} variant="ghost"><Icon as={MdRemove}/></Button>
								</Text>
								<Text>{`${product?.quantity} ${product?.unitOfMeasure?.name} remaining`}</Text>
							</VStack>
							<Stack>
								<Button onClick={()=>{
									addProduct({
										productId: product?._id!,
										quantity: quantity,
									})
								}}>
									ADD
								</Button>
							</Stack>
						</Stack>
				</Box>
			</Center>
			<ModalComp title="" isModalOpen={isOpen} onModalClose={() => {onClose(); closeProduct && closeProduct();}}>
				<Text>Item Added!</Text>
			</ModalComp>
		</>
  );
}