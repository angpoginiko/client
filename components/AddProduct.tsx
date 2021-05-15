import React, { useRef } from 'react';
import { useForm } from 'react-hook-form'
import { ProductType } from '../interfaces/index'
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Heading,
  useColorModeValue,
	Input,
	FormErrorMessage,
	useDisclosure
} from '@chakra-ui/react';
import ModalComp from './ModalComp';

interface AddCashierProps {
	modalClose: () => void;
	refresh: () => void;
}

export default function AddCashier({ modalClose, refresh } : AddCashierProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	const onSubmit = async (formData: ProductType) => {
		const response = await fetch("/api/products/addProducts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({product: formData}),
		});
		await response.json();
		onOpen();
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Add New Cashier</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="productName" isInvalid={errors.productName && errors.productName.type === "required"}>
              <FormLabel>Name</FormLabel>
              <Input name="productName" ref={register({required:true})} />
							<FormErrorMessage>Name Required</FormErrorMessage>
            </FormControl>

						<FormControl id="quantity" isInvalid={errors.quantity && errors.quantity.type === "required"}>
              <FormLabel>Quantity</FormLabel>
              <Input name="quantity" ref={register({required:true})} />
							<FormErrorMessage>Quantity Required</FormErrorMessage>
            </FormControl>

						<FormControl id="unitPrice" isInvalid={errors.unitPrice && errors.unitPrice.type === "required"}>
              <FormLabel>Price</FormLabel>
              <Input name="unitPrice" ref={register({required:true})}/>
							<FormErrorMessage>Price Required</FormErrorMessage>
            </FormControl>

            <FormControl id="productType" isInvalid={errors.productType && errors.productType.type === "required"}>
              <FormLabel>Product Type</FormLabel>
              <Input name="productType" ref={register({required:true})}/>
							<FormErrorMessage>ProductType Required</FormErrorMessage>
            </FormControl>

						<FormControl id="productDesc" isInvalid={errors.productDesc && errors.productDesc.type === "required"}>
              <FormLabel>Product Description</FormLabel>
              <Input name="productDesc" ref={register({required:true})}/>
							<FormErrorMessage>ProductType Description</FormErrorMessage>
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
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose(), refresh()}} title="Add Cashier">
				Item Added!!!
			</ModalComp>
		</>
	);
}