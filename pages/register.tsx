import React from 'react';
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
} from '@chakra-ui/react';


const Register : React.FC = () => {
	const { register, handleSubmit } = useForm();
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
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input name="name" ref={register} />
            </FormControl>
						<FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input name="username" ref={register} />
            </FormControl>
						<FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input name="email" ref={register} type="email"/>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input name="password" ref={register} type="password"/>
            </FormControl>
						<FormControl id="repeatpassword">
              <FormLabel>Repeat Password</FormLabel>
              <Input name="repeatpassword" ref={register} type="password"/>
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

export default Register;