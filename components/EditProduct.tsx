import React, { ChangeEvent } from 'react';
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
	Textarea
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { useQuery } from 'react-query';
import { useState } from 'react';

interface AddCashierProps {
	modalClose: () => void;
	refresh: () => void;
	defaultValues: ProductType;
}

export default function AddCashier({ modalClose, refresh, defaultValues } : AddCashierProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [image, setImage] = useState<string | ArrayBuffer | null>(defaultValues.image!.toString());
	const { register, handleSubmit, errors } = useForm();
	const onSubmit = async (formData: ProductType) => {
		const { image, ...data } = formData;
    if(image?.length != 0) { 
			const reader = new FileReader();
			let newImage : string | ArrayBuffer | null = '';
			reader.onload = async () =>{
				if(reader.readyState === 2){
					newImage = reader.result;
					const response = await fetch(`/api/products/product/${defaultValues._id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({product: data, image: newImage}),
					});
					await response.json();
					onOpen();
				}
			}
			reader.readAsDataURL(image?.length == 0 ? defaultValues.image![0] as Blob : image![0] as Blob);
		} else {
			const response = await fetch(`/api/products/product/${defaultValues._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({product: data, image: defaultValues.image}),
			});
			await response.json();
			onOpen();
		}
	}

	const fetchProductTypes = async () => {
		const res = await fetch(`api/productType/getProductTypes`);
		return res.json();
	}
	const { data: productTypes } = useQuery<ProductTypeType[]>("productTypes", fetchProductTypes);

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

	const toPascalCase = (text: string | undefined) => {
		const newString = text?.replace(/\w+/g,
			function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
		return newString;
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
              <Input name="productName" ref={register({required:true})} defaultValue={defaultValues.productName}/>
							<FormErrorMessage>Name Required</FormErrorMessage>
            </FormControl>

						<FormControl id="productType" isInvalid={errors.productType && errors.productType.type === "required"}>
              <FormLabel>Product Family</FormLabel>
              <Select name="productType" placeholder="--Product Family--" ref={register({required:true})} defaultValue={defaultValues.productType?._id}>
								{productTypes && productTypes.map((productType) => {
									return (<option value={productType._id} key={productType.name}>{toPascalCase(productType.name)}</option>);
								})}
							</Select>
							<FormErrorMessage>ProductType Required</FormErrorMessage>
            </FormControl>

						<FormControl id="unitPrice" isInvalid={errors.unitPrice && errors.unitPrice.type === "required"}>
              <FormLabel>Price per Unit of Measure</FormLabel>
              <Input name="unitPrice" ref={register({required:true})} defaultValue={defaultValues.unitPrice}/>
							<FormErrorMessage>Price Required</FormErrorMessage>
            </FormControl>

						<FormControl id="reorderingStock" isInvalid={errors.reorderingStock && errors.reorderingStock.type === "required"}>
              <FormLabel>Minimum Stock</FormLabel>
              <Input name="reorderingStock" ref={register({required:true})} defaultValue={defaultValues.reorderingStock}/>
							<FormErrorMessage>Minimum Stock Required</FormErrorMessage>
            </FormControl>

						<FormControl id="unitOfMeasure" isInvalid={errors.unitOfMeasure && errors.unitOfMeasure.type === "required"}>
              <FormLabel>Unit Of Measure</FormLabel>
              <Select name="unitOfMeasure" placeholder="--Unit of Measure--" ref={register({required:true})} defaultValue={defaultValues.unitOfMeasure?._id}>
								{unitOfMeasure && unitOfMeasure.map((unitOfMeasure) => {
									return (<option value={unitOfMeasure._id} key={unitOfMeasure.name}>{toPascalCase(unitOfMeasure.name)}</option>);
								})}
							</Select>
							<FormErrorMessage>ProductType Required</FormErrorMessage>
            </FormControl>

						<FormControl id="productDesc" isInvalid={errors.productDesc && errors.productDesc.type === "required"}>
              <FormLabel>Product Description</FormLabel>
              <Textarea name="productDesc" ref={register({required:true})} defaultValue={defaultValues.productDesc}/>
							<FormErrorMessage>ProductType Description</FormErrorMessage>
            </FormControl>

						<FormControl id="image">
              <FormLabel>Image Required</FormLabel>
							<img src={image?.toString()} alt="" id="img" className="img" />
              <input type="file" name="image" ref={register} onChange={imageHandler} accept="image/*"/>
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
                Save
              </Button>
            </Stack>
          </Stack>
				</form>	
        </Box>
      </Stack>
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose(), refresh()}} title="Add Cashier">
				Item Edited!!!
			</ModalComp>
		</>
	);
}