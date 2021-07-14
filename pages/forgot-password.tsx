import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout';
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
	Text
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { server } from '../config';
import { formAuth } from './api/formAuth';
import userRoles from '../constants/userRoles'
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import ModalComp from '../components/ModalComp';
import AnswerChallengeQuestion from '../components/AnswerChallengeQuestion';
import EditPassword from '../components/EditPassword';

type FormData = {
  username: string;
};


export default function Login (){
	const { register, handleSubmit, errors } = useForm();
	const [isLoading, setIsLoading] = useState(false);
	const { onOpen, isOpen, onClose } = useDisclosure();
	const { onOpen: onOpenPassword, isOpen: isOpenPassword, onClose: onClosePassword } = useDisclosure();
	const { onOpen: onOpenQuestion, isOpen: isOpenQuestion, onClose: onCloseQuestion } = useDisclosure();
	const [userId, setUserId] = useState("")

	const onSubmit = async (formData: FormData) => {
		const response = await fetch ("/api/profile/forgot-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({username: formData.username}),
		})
		const user = await response.json();
		console.log(user.id)
		if(user.userRole == userRoles.Customer){
			setUserId(user.id);
			onOpenQuestion();
		} else {
			onOpen();
		}

	}
	return(
		<>
		<Layout title="Forgot Password" onStore={false} setIsLoading={setIsLoading}>
      {!isLoading ? <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Forgot Password</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="username" isInvalid={errors.username && errors.username.type === "required"}>
              <FormLabel>Username</FormLabel>
              <Input name="username" ref={register({required:true})}/>
							<FormErrorMessage>Username Required</FormErrorMessage>
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
                Sign in
              </Button>
            </Stack>
          </Stack>
				</form>	
        </Box>
      </Stack> : <PageLoader size="xl"/>}
	</Layout>
	{!isLoading && <Footer />}
	<ModalComp isModalOpen={isOpenQuestion} onModalClose={onCloseQuestion} title="">
		<AnswerChallengeQuestion customerId={userId} modalClose={onCloseQuestion} onOpen={onOpenPassword} />
	</ModalComp>

	<ModalComp isModalOpen={isOpenPassword} onModalClose={onClosePassword} title="">
		<EditPassword modalClose={onClosePassword} id={userId}/>
	</ModalComp>

	<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
		<Text>Please contact an Admin to change your password</Text>
	</ModalComp>
	</>
	);
}

Login.getInitialProps = async (ctx: NextPageContext) => {
  const json = await formAuth(`${server}/api/profile/retrieve`, ctx);
	return {json};
}