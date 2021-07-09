import React, { ChangeEvent, useState } from 'react';
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
	FormErrorMessage,
	useDisclosure,
} from '@chakra-ui/react';
import ModalComp from './ModalComp';

interface CreateProductProps {
	modalClose: () => void;
}

export default function AddCarouselImage1({ modalClose } : CreateProductProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [image, setImage] = useState<string | ArrayBuffer | null>("")
	const { register, handleSubmit, errors } = useForm();


	const onSubmit = async (formData: ProductType) => {
    const reader = new FileReader();
		let newImage : string | ArrayBuffer | null = '';
     reader.onload = async () =>{
      if(reader.readyState === 2){
        newImage = reader.result;
				const response = await fetch("/api/carousel/add1", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					},
					body: JSON.stringify({image: newImage}),
				});
				await response.json();
				onOpen();
      }
    }
    reader.readAsDataURL(formData.image![0] as Blob);
	}

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
          <Heading fontSize={'4xl'}>Image Upload 1</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>

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
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose()}} title="Add Cashier">
				Image Added!!!
			</ModalComp>
		</>
	);
}