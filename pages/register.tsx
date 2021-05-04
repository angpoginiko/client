import React, { useRef } from 'react';
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout';
import { Profile } from '../interfaces/index'
import { useRouter } from 'next/router'
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


const Register : React.FC = () => {
	const { register, handleSubmit, errors } = useForm();
	const Router = useRouter();
	const onSubmit = async (formData: Profile) => {
		const response = await fetch("/api/profile/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({profile: formData}),
		});
		await response.json();
		Router.push("/login");
	}
	const password = useRef();
	return(
		<>
		<Layout title="Register">
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

						<FormControl id="repeatpassword" isInvalid={errors.repeatpassword && errors.repeatpassword.message}>
              <FormLabel>Repeat Password</FormLabel>
              <Input name="repeatpassword" ref={register({ validate: value => value === password.current || "The passwords do not match"})} type="password"/>
							<FormErrorMessage>{errors.repeatpassword?.message}</FormErrorMessage>
            </FormControl>

            <Stack spacing={10}>
						<Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
								<Text color={'gray.600'}>
									Already have an account? <Link color={'blue.400'} href="/login">Sign in</Link>
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

export default Register;