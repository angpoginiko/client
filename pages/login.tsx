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
} from '@chakra-ui/react';

type FormData = {
  username: string;
  password: string;
};


const Login : React.FC = () => {
	const { register, handleSubmit } = useForm();
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
		await router.push("/");
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
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <input name="username" ref={register} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <input name="password" ref={register} type="password"/>
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

export default Login;