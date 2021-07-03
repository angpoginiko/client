import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form'
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
	NumberIncrementStepper,
	NumberInputStepper,
	NumberInputField,
	NumberInput,
	NumberDecrementStepper,
	Select
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/themes/confetti.css";
import { ProductType, UnitOfMeasureType } from '../interfaces';
import { useQuery } from 'react-query';

interface AddProductProps {
	modalClose: () => void;
	refresh: () => void;
	productId?: string;
	productName: string;
}

export default function AddProduct({ modalClose, refresh, productId, productName } : AddProductProps) {
	const [errorText, setErrorText] = useState("")
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose} = useDisclosure();
	const { register, handleSubmit, errors, control } = useForm();
	const [date, setDate] = useState(new Date());
	const onSubmit = async (formData: ProductType) => {
			const response = await fetch("/api/receivingProducts/addReceivingProducts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({receivingProducts: formData, productId}),
			});
			const json = await response.json();
			if(response.ok){
				onOpen();
			} else {
				setErrorText(json.message);
				onErrorOpen();
			}
			
	}

	const fetchUnitOfMeasure = async () => {
		const res = await fetch(`api/unitOfMeasure/getUnitOfMeasure`);
		return res.json();
	}
	const { data: unitOfMeasure } = useQuery<UnitOfMeasureType[]>("unitOfMeasure", fetchUnitOfMeasure);

	const toPascalCase = (text: string | undefined) => {
		const newString = text?.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		return newString;
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'3xl'}>Add Product: {productName}</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
						<FormControl id="quantity" isInvalid={errors.quantity && errors.quantity.type === "required"}>
              <FormLabel>Quantity per package</FormLabel>
							<NumberInput>
								<NumberInputField name="quantity" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Quantity Required</FormErrorMessage>
            </FormControl>

						<FormControl id="unitOfMeasure" isInvalid={errors.unitOfMeasure && errors.unitOfMeasure.type === "required"}>
              <FormLabel>Package Unit of Measure</FormLabel>
              <Select name="unitOfMeasure" placeholder="--Unit of Measure--" ref={register({required:true})}>
								{unitOfMeasure && unitOfMeasure.map((unitOfMeasure) => {
									return (<option value={unitOfMeasure._id} key={unitOfMeasure.name}>{toPascalCase(unitOfMeasure.name)}</option>);
								})}
							</Select>
							<FormErrorMessage>Unit of Measure Required</FormErrorMessage>
            </FormControl>

						<FormControl id="expiryDate" isInvalid={errors.expiryDate && errors.expiryDate.type === "required"}>
              <FormLabel>Expiry Date</FormLabel>
              <Controller
								as={<Flatpickr name="expiryDate" className="chakra-input css-n9lnwn"/>}
								value={date}
								onChange={(date: Date) => setDate(date)}
								name="expiryDate"
								control={control}
								className="chakra-input css-n9lnwn"
								defaultValue={new Date}
							/>
							<FormErrorMessage>Expiry Date Required</FormErrorMessage>
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
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose(), refresh()}} title="">
				New Product Added
			</ModalComp>
			<ModalComp isModalOpen={isErrorOpen} onModalClose={onErrorClose} title="Error!">
				<Text>
					{errorText}
				</Text>
			</ModalComp>
		</>
	);
}