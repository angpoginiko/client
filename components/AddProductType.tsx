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
	Input,
	FormErrorMessage,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import ModalComp from './ModalComp';

interface AddProductType {
	modalClose: () => void;
	refresh: () => void;
}

export default function AddProduct({ modalClose, refresh } : AddProductType) {
	const [errorText, setErrorText] = useState("")
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	const onSubmit = async (formData: object) => {
			const response = await fetch("/api/productType/addProductType", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const json = await response.json();
			if(response.ok){
				onOpen();
			} else {
				setErrorText(json.message);
				onErrorOpen();
			}
			
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Add Product Type</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="name" isInvalid={errors.name && errors.username.type === "required"}>
              <FormLabel>Name</FormLabel>
              <Input name="name" ref={register({required:true})} />
							<FormErrorMessage>Name Required</FormErrorMessage>
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
				Property Type Added!!!
			</ModalComp>
			<ModalComp isModalOpen={isErrorOpen} onModalClose={onErrorClose} title="Error!">
				<Text>
					{errorText}
				</Text>
			</ModalComp>
		</>
	);
}