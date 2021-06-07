import React, { useRef } from 'react';
import { useForm } from 'react-hook-form'
import { ProductType, ProductTypeType, Profile } from '../interfaces/index'
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
	Select
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
interface EditProfileProps {
	modalClose: () => void;
	refresh: () => void;
	defaultValues?: Profile;
	id: string;
}

export default function EditProfile({ modalClose, refresh, defaultValues, id } : EditProfileProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	
	const onSubmit = async (formData: Profile) => {
		const response = await fetch (`/api/profile/profiles/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({profile: formData}),
		})
		await response.json();
		onOpen();
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Edit Profile</Heading>
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
              <Input name="name" ref={register({required:true})} defaultValue={defaultValues?.name}/>
							<FormErrorMessage>Name Required</FormErrorMessage>
            </FormControl>

						<FormControl id="username" isInvalid={errors.username && errors.username.type === "required"}>
              <FormLabel>Username</FormLabel>
              <Input name="username" ref={register({required:true})} defaultValue={defaultValues?.username}/>
							<FormErrorMessage>Username Required</FormErrorMessage>
            </FormControl>

						<FormControl id="email" isInvalid={errors.email && errors.email.type === "required"}>
              <FormLabel>Email</FormLabel>
              <Input name="email" ref={register({required:true})} type="email" defaultValue={defaultValues?.email}/>
							<FormErrorMessage>Email Required</FormErrorMessage>
            </FormControl>

						<FormControl id="address" isInvalid={errors.address && errors.address.type === "required"}>
              <FormLabel>Address</FormLabel>
              <Input name="address" ref={register({required:true})} defaultValue={defaultValues?.address}/>
							<FormErrorMessage>Address Required</FormErrorMessage>
            </FormControl>

						<FormControl id="gender" isInvalid={errors.gender && errors.gender.type === "required"}>
              <FormLabel>Gender</FormLabel>
              <Select name="gender" placeholder="--Gender--" ref={register({required:true})} defaultValue={defaultValues?.gender}>
								<option value="male" >
									Male
								</option>
								<option value="female">
									Female
								</option>
							</Select>
							<FormErrorMessage>Gender Required</FormErrorMessage>
            </FormControl>

						<FormControl id="mobilenumber" isInvalid={errors.mobilenumber && errors.mobilenumber.type === "required"}>
							<FormLabel>Mobile Number</FormLabel>
              	<Input name="mobilenumber" ref={register({required:true})} defaultValue={defaultValues?.mobileNumber}/>
							<FormErrorMessage>Mobile Number Required</FormErrorMessage>
            </FormControl>

						<FormControl id="tin" isInvalid={errors.tin && errors.tin.type === "required"}>
              <FormLabel>TIN Number</FormLabel>
              	<Input name="tin" ref={register({required:true})} defaultValue={defaultValues?.tin}/>
							<FormErrorMessage>TIN Number Required</FormErrorMessage>
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
				Profile Edited
			</ModalComp>
		</>
	);
}