import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import { PasswordType } from '../interfaces/index'
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

interface EditPasswordProps {
	id: string;
	modalClose: () => void;
}

export default function EditPassword({ id, modalClose } : EditPasswordProps) {
	const [errorMessage, setErrorMessage] = useState('')
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError} = useDisclosure();
	const { register, handleSubmit, errors, watch } = useForm();
	const password = useRef({});
  password.current = watch("newpassword", "");
	
	const onSubmit = async (formData: PasswordType) => {
		const response = await fetch (`/api/profile/editpassword`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({oldpassword: formData.oldpassword , newpassword: formData.newpassword, id}),
		})
		const json = await response.json();
		if(response.ok){
			onOpen();
		} else {
			setErrorMessage(json.message);
			onOpenError();
		}
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Edit Password</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
						
						<FormControl id="oldpassword" isInvalid={errors.oldpassword && errors.oldpassword.type === "required"}>
              <FormLabel>Old Password</FormLabel>
              <Input name="oldpassword" ref={register({required:true})} type="password"/>
							<FormErrorMessage>Old Password Required</FormErrorMessage>
            </FormControl>

						<FormControl id="newpassword" isInvalid={errors.newpassword && errors.newpassword.type === "required"}>
							<FormLabel>New Password</FormLabel>
							<Input name="newpassword" ref={register({required:true})} type="password"/>
							<FormErrorMessage>New Password Required</FormErrorMessage>
						</FormControl>


						<FormControl id="repeatpassword" isInvalid={errors.repeatpassword}>
              <FormLabel>Repeat Password</FormLabel>
              <Input 
							name="repeatpassword"
							type="password"
							ref={register({
								required: "Repeat Password is required",
								validate: value =>
								value === password.current || "The passwords do not match"
							})}
							/>
							<FormErrorMessage>{errors.repeatpassword && errors.repeatpassword.message}</FormErrorMessage>
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
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose()}} title="Add Cashier">
				Password Edited
			</ModalComp>
			<ModalComp isModalOpen={isOpenError} onModalClose={onCloseError} title="Password Error">
				{errorMessage}
			</ModalComp>
		</>
	);
}