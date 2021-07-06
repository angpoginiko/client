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
import useUnitConverter from '../hooks/useUnitConverter';

interface ToStockProps {
	productId: string;
	receivingProductId: string;
	quantity: number;
	modalClose: () => void;
	refresh: () => void;
	expiryDate: Date;
	productUnitOfMeasure: string;
	receivingUnitOfMeasure: string;
}

export default function ToStock({ 
	productId, 
	receivingProductId, 
	quantity, 
	modalClose, 
	refresh,
	expiryDate,
	productUnitOfMeasure,
	receivingUnitOfMeasure
} : ToStockProps) {
	const [errorText, setErrorText] = useState("")
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose} = useDisclosure();
	const {isOpen: isMoreOpen, onOpen: onMoreOpen, onClose: onMoreClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	const { toGrams, toKilogram, toLiter, toMililiter } = useUnitConverter();

	
	const onSubmit = async (formData: StorageDisplayProductType) => {
		if(formData.quantity! > quantity){
			onMoreOpen();
		} else {
			let unitToMeasure: number | undefined = 0;
				if(productUnitOfMeasure.toLowerCase() == receivingUnitOfMeasure.toLowerCase()){
					unitToMeasure = formData.quantity
				}
				else if(productUnitOfMeasure.toLowerCase() == "grams"){
					unitToMeasure = toGrams(formData.quantity!, receivingUnitOfMeasure);
				} else if(productUnitOfMeasure.toLowerCase() == "mililiters"){
					unitToMeasure = toMililiter(formData.quantity!, receivingUnitOfMeasure);
				} else if(productUnitOfMeasure.toLowerCase() == "kilograms"){
					unitToMeasure = toKilogram(formData.quantity!, receivingUnitOfMeasure);
				} else if(productUnitOfMeasure.toLowerCase() == "liters"){
					unitToMeasure = toLiter(formData.quantity!, receivingUnitOfMeasure);
				}
				const response = await fetch("/api/stock/addStock", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({quantity: unitToMeasure, productId, receivingProductId, expiryDate, receivingQuantity: formData.quantity}),
				});
				const json = await response.json();
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
          <Heading fontSize={'3xl'}>Add to Storage Room</Heading>
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
								<FormHelperText>Stock Remaining: {quantity} {receivingUnitOfMeasure}</FormHelperText>
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
				onClose(),
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