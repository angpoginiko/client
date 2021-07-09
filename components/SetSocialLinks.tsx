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
	const { register, handleSubmit, errors, watch } = useForm();
	const onSubmit = async (formData: Profile) => {
		const response = await fetch("/api/socialMedia/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({links: formData}),
		});
		await response.json();
		onOpen();
	}
	const password = useRef();
	password.current = watch("password", "");
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Social Media Links</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="facebook" isInvalid={errors.facebook && errors.facebook.type === "required"}>
              <FormLabel>Facebook</FormLabel>
              <Input name="facebook" ref={register({required:true})} />
							<FormErrorMessage>Facebook Link Required</FormErrorMessage>
            </FormControl>

						<FormControl id="twitter" isInvalid={errors.twitter && errors.twitter.type === "required"}>
              <FormLabel>Twitter</FormLabel>
              <Input name="twitter" ref={register({required:true})} />
							<FormErrorMessage>Twitter Link Required</FormErrorMessage>
            </FormControl>

						<FormControl id="instagram" isInvalid={errors.instagram && errors.instagram.type === "required"}>
              <FormLabel>Instagram</FormLabel>
              <Input name="instagram" ref={register({required:true})} />
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
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), modalClose()}} title="Add Cashier">
				Admin Added!!!
			</ModalComp>
		</>
	);
}