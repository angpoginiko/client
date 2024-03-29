import React, { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form'
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Heading,
  useColorModeValue,
	FormErrorMessage,
	useDisclosure,
	NumberIncrementStepper,
	NumberInputStepper,
	NumberInput,
	NumberDecrementStepper,
	NumberInputField
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { ProductType } from '../interfaces';

interface HomeQuantityProps {
	onModalClose: () => void;
	product: ProductType;
	customerId: string;
	defaultQuantity: number;
	refetch: () => void;
}

type quantity = {
	quantity: number,
}


export default function HomeQuantity({ onModalClose, product, customerId, defaultQuantity,refetch } : HomeQuantityProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	const [quantity, setQuantity] = useState(0);
	const onSubmit = async (quantity: quantity) => {
		const response = await fetch (`/api/list/setQuantity`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({productId: product._id, quantity, customerId}),
		});
		await response.json();
		onOpen();
		refetch();
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuantity(parseInt(e.target.value));
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Quantity</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="quantity" isInvalid={errors.quantity && errors.quantity.type === "required"}>
						<FormLabel>Quantity:</FormLabel>
							<NumberInput defaultValue={defaultQuantity}	max={parseInt(product.quantity?.toString()!)}>
								<NumberInputField 
									name="quantity" 
									ref={register({required:true})} 
									onChange={handleChange} 
								/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Quantity Required</FormErrorMessage>
							<FormLabel>{product.quantity} {product.unitOfMeasure?.name} remaining, P{quantity ? product.unitPrice! * quantity : product.unitPrice}</FormLabel>
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
								type="submit"
								>
                Add
              </Button>
            </Stack>
          </Stack>
				</form>	
        </Box>
      </Stack>
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), onModalClose()}} title="Add Cashier">
				Product Added to Cart
			</ModalComp>
		</>
	);
}