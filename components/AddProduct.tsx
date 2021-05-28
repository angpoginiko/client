import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import { ProductType, ProductTypeType } from '../interfaces/index'
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

interface AddCashierProps {
	modalClose: () => void;
	refresh: () => void;
}

export default function AddCashier({ modalClose, refresh } : AddCashierProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [image, setImage] = useState<string | ArrayBuffer | null>("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
	const { register, handleSubmit, errors } = useForm();


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
    reader.readAsDataURL(image[0] as Blob);
	}
	const fetchCart = async () => {
		const res = await fetch(`api/productType/getProductTypes`);
		return res.json();
	}

	const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () =>{
      if(reader.readyState === 2){
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  };
	
	const { data: productTypes } = useQuery<ProductTypeType[]>("productTypes", fetchCart);
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Add Product</Heading>
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
							<NumberInput>
								<NumberInputField name="quantity" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Quantity Required</FormErrorMessage>
            </FormControl>

						<FormControl id="unitPrice" isInvalid={errors.unitPrice && errors.unitPrice.type === "required"}>
              <FormLabel>Price</FormLabel>
							<NumberInput>
								<NumberInputField name="unitPrice" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Price Required</FormErrorMessage>
            </FormControl>

            <FormControl id="productType" isInvalid={errors.productType && errors.productType.type === "required"}>
              <FormLabel>Product Type</FormLabel>
              <Select name="productType" placeholder="--Product Types--" ref={register({required:true})}>
								{productTypes && productTypes.map((productType) => {
									return (<option value={productType._id} key={productType.name}>{productType.name}</option>);
								})}
							</Select>
							<FormErrorMessage>ProductType Required</FormErrorMessage>
            </FormControl>

						<FormControl id="productDesc" isInvalid={errors.productDesc && errors.productDesc.type === "required"}>
              <FormLabel>Product Description</FormLabel>
              <Textarea name="productDesc" ref={register({required:true})}/>
							<FormErrorMessage>ProductType Description</FormErrorMessage>
            </FormControl>


						<FormControl id="image" isInvalid={errors.image && errors.image.type === "required"}>
              <FormLabel>Image Required</FormLabel>
							<img src={image?.toString()} alt="" id="img" className="img" />
              <input type="file" name="image" ref={register({required:true})} onChange={imageHandler} accept="image/*"/>
							<FormErrorMessage>ProductType Description Required</FormErrorMessage>
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