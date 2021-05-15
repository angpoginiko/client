import React, { useRef } from 'react';
import { useForm } from 'react-hook-form'
import { Profile } from '../interfaces/index'
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
}

export default function AddCashier({ modalClose } : AddCashierProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	const onSubmit = async (formData: Profile) => {
		const response = await fetch("/api/profile/AddCashier", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({profile: formData}),
		});
		await response.json();
		onOpen();
	}
	const password = useRef();
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
            <FormControl id="name" isInvalid={errors.name && errors.username.type === "required"}>
              <FormLabel>Name</FormLabel>
              <Input name="name" ref={register({required:true})} />
							<FormErrorMessage>Name Required</FormErrorMessage>
            </FormControl>

						<FormControl id="username" isInvalid={errors.username && errors.username.type === "required"}>
              <FormLabel>Username</FormLabel>
              <Input name="username" ref={register({required:true})} />
							<FormErrorMessage>Username Required</FormErrorMessage>
            </FormControl>

						<FormControl id="email" isInvalid={errors.email && errors.email.type === "required"}>
              <FormLabel>Email</FormLabel>
              <Input name="email" ref={register({required:true})} type="email"/>
							<FormErrorMessage>Email Required</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={errors.password && errors.password.type === "required"}>
              <FormLabel>Password</FormLabel>
              <Input name="password" ref={register({required:true})} type="password"/>
							<FormErrorMessage>Password Required</FormErrorMessage>
            </FormControl>

						<FormControl id="repeatpassword" isInvalid={errors.repeatpassword && errors.repeatpassword.type === "required"}>
              <FormLabel>Repeat Password</FormLabel>
              <Input name="repeatpassword" ref={register({required:true})} type="password"/>
							<FormErrorMessage>Repeat Password Requireed</FormErrorMessage>
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
				Cashier Added!!!
			</ModalComp>
		</>
	);
}