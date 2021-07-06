import React, { useState } from 'react';
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
	Text,
	useDisclosure,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberDecrementStepper,
	NumberIncrementStepper,
	FormHelperText
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { StorageDisplayProductType } from '../interfaces';

interface ToDisplayProps {
	stock: StorageDisplayProductType;
	modalClose: () => void;
	refresh: () => void;
}

export default function ToDisplay({ 
	stock, 
	modalClose, 
	refresh,
} : ToDisplayProps) {
	const [errorText, setErrorText] = useState("")
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose} = useDisclosure();
	const {isOpen: isMoreOpen, onOpen: onMoreOpen, onClose: onMoreClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	
	const onSubmit = async (formData: StorageDisplayProductType) => {
		if(formData.quantity! > stock.quantity!){
			onMoreOpen();
		} else {
			const response = await fetch("/api/display/addDisplayProducts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					quantity: formData.quantity, 
					expiryDate: stock.expiryDate, 
					capacity: stock.product?.capacity,
					productId: stock.product?._id
				}),
			});
			const json = await response.json();
			console.log(response.ok);
			if(response.ok){
				onOpen();
			} else {
				setErrorText(json.message);
				onErrorOpen();
			}
		}
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'3xl'}>Add to Display</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
						<FormControl id="quantity" isInvalid={errors.quantity && errors.quantity.type === "required"}>
							<FormLabel>Quantity to Add</FormLabel>
							<NumberInput>
								<NumberInputField name="quantity" ref={register({required:true})}/>
								<FormHelperText>Stock Remaining: {stock.quantity}</FormHelperText>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Quantity to Add is Required</FormErrorMessage>
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
			<ModalComp 
			isModalOpen={isOpen} 
			onModalClose={() => {
				modalClose(), 
				onClose()
				refresh()
				}} 
			title="Add Cashier">
				New Stock Added!
			</ModalComp>
			<ModalComp isModalOpen={isErrorOpen} onModalClose={onErrorClose} title="Error!">
				<Text>
					{errorText}
				</Text>
			</ModalComp>
			<ModalComp isModalOpen={isMoreOpen} onModalClose={onMoreClose} title="Error!">
				<Text>
					Item is more than the stock
				</Text>
			</ModalComp>
		</>
	);
}