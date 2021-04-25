import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout';
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
	Input,
	FormErrorMessage,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { server } from '../config';
import { formAuth } from './api/formAuth';

type FormData = {
  username: string;
  password: string;
};


export default function Login (){
	const { register, handleSubmit, errors } = useForm();
	const router = useRouter();

	const onSubmit = async (formData: FormData) => {
		const response = await fetch ("/api/profile/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: JSON.stringify({profile: formData}),
		})
		await response.json();
		await router.push("/Home");
	}
	return(
		<>
		<Layout title="Login">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
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
            <FormControl id="password" isInvalid={errors.password && errors.password.type === "required"}>
              <FormLabel>Password</FormLabel>
              <Input name="password" ref={register({required:true})} type="password"/>
							<FormErrorMessage>Password Required</FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
						<Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
								<Text color={'gray.600'}>
									Don't have an account? <Link color={'blue.400'} href="/register">Register</Link>
								</Text>
						</Stack>
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
      </Stack>
	</Layout>
	</>
	);
}

Login.getInitialProps = async (ctx: NextPageContext) => {
  const json = await formAuth(`${server}/api/profile/retrieve`, ctx);
	return {json};
}