import React, { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form'
import { ProductType, ProductTypeType, UnitOfMeasureType } from '../interfaces/index'
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
	useDisclosure,
	Select,
	NumberInputField,
	NumberInputStepper,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	Textarea
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { useQuery } from 'react-query';
import useCase from '../hooks/useCase';

interface CreateProductProps {
	modalClose: () => void;
	refresh: () => void;
}

export default function CreateProduct({ modalClose, refresh } : CreateProductProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [image, setImage] = useState<string | ArrayBuffer | null>("")
	const { register, handleSubmit, errors } = useForm();
	const { toPascalCase } = useCase();


	const onSubmit = async (formData: ProductType) => {
		const { image, ...data } = formData;
    const reader = new FileReader();
		let newImage : string | ArrayBuffer | null = '';
     reader.onload = async () =>{
      if(reader.readyState === 2){
        newImage = reader.result;
				const response = await fetch("/api/products/addProducts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					},
					body: JSON.stringify({product: data, image: newImage}),
				});
				await response.json();
				onOpen();
      }
    }
    reader.readAsDataURL(image![0] as Blob);
	}
	
	const fetchProductType = async () => {
		const res = await fetch(`api/productType/getProductTypes`);
		return res.json();
	}
	const { data: productTypes } = useQuery<ProductTypeType[]>("productTypes", fetchProductType);

	const fetchUnitOfMeasure = async () => {
		const res = await fetch(`api/unitOfMeasure/getUnitOfMeasure`);
		return res.json();
	}
	const { data: unitOfMeasure } = useQuery<UnitOfMeasureType[]>("unitOfMeasure", fetchUnitOfMeasure);

	const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () =>{
      if(reader.readyState === 2){
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files![0])
  };

	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Create Product</Heading>
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

						<FormControl id="productType" isInvalid={errors.productType && errors.productType.type === "required"}>
              <FormLabel>Product Family</FormLabel>
              <Select name="productType" placeholder="--Product Family--" ref={register({required:true})}>
								{productTypes && productTypes.map((productType) => {
									return (<option value={productType._id} key={productType.name}>{toPascalCase(productType.name)}</option>);
								})}
							</Select>
							<FormErrorMessage>ProductType Required</FormErrorMessage>
            </FormControl>

						<FormControl id="soldBy" isInvalid={errors.soldBy && errors.soldBy.type === "required"}>
              <FormLabel>Sold By</FormLabel>
              <Select name="soldBy" placeholder="--Sold By--" ref={register({required:true})}>
								{unitOfMeasure && unitOfMeasure.map((unitOfMeasure) => {
									return (<option value={unitOfMeasure._id} key={unitOfMeasure.name}>{toPascalCase(unitOfMeasure.name)}</option>);
								})}
							</Select>
							<FormErrorMessage>Sold By Required</FormErrorMessage>
            </FormControl>
						
						<FormControl id="unitPrice" isInvalid={errors.unitPrice && errors.unitPrice.type === "required"}>
              <FormLabel>Price per Unit of Measure</FormLabel>
							<NumberInput>
								<NumberInputField name="unitPrice" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Price Required</FormErrorMessage>
            </FormControl>

						<FormControl id="reorderingStock" isInvalid={errors.reorderingStock && errors.reorderingStock.type === "required"}>
              <FormLabel>Minimum Stock</FormLabel>
							<NumberInput>
								<NumberInputField name="reorderingStock" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Minimum Stock</FormErrorMessage>
            </FormControl>

						<FormControl id="productDesc">
              <FormLabel>Product Description</FormLabel>
              <Textarea name="productDesc" ref={register}/>
            </FormControl>
						
						<FormControl id="image" isInvalid={errors.image && errors.image.type === "required"}>
              <FormLabel>Image Required</FormLabel>
							<img src={image?.toString()} alt="" id="img" className="img" />
              <input type="file" name="image" ref={register({required:true})} onChange={imageHandler} accept="image/*"/>
							<FormErrorMessage>Product Image is Required</FormErrorMessage>
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