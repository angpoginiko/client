import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form'
import Layout from '../components/Layout';
import { ChallengeQuestions, Profile } from '../interfaces/index'
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
	useDisclosure,
	FormHelperText,
	Select,
	InputRightElement,
	InputGroup
} from '@chakra-ui/react';
import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/themes/confetti.css";
import ModalComp from '../components/ModalComp';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import { useQuery } from 'react-query';


const Register : React.FC = () => {
	const { register, handleSubmit, errors, watch, control } = useForm();
	const {isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError} = useDisclosure();
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false)
	const [show1, setShow1] = useState(false)

	const handleClick = () => setShow(!show)
	const handleClick1 = () => setShow1(!show1)

	const Router = useRouter();
	const onSubmit = async (formData: Profile) => {
		setIsLoading(true);
		const response = await fetch("/api/profile/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({profile: formData}),
		});
		const json = await response.json();
		if(response.ok){	
			Router.push("/login");
		} else {
			setErrorMessage(json.message);
			onOpenError();
		}
	}
	const password = useRef();
	password.current = watch("password", "");
	
	const fetchUnitOfMeasure = async () => {
		const res = await fetch(`api/challengeQuestion/getChallengeQuestions`);
		return res.json();
	}
	const { data: challengeQuestions } = useQuery<ChallengeQuestions[]>("challengeQuestions", fetchUnitOfMeasure);
	return(
		<>
		<Layout title="Register" onStore={false} setIsLoading={setIsLoading}>
      {!isLoading ? <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign up</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="name" isInvalid={errors.name && errors.name.type === "required"}>
              <FormLabel>Name</FormLabel>
              <Input name="name" ref={register({required:true})} />
							<FormErrorMessage>Name Required</FormErrorMessage>
            </FormControl>

						<FormControl id="username" isInvalid={errors.username}>
              <FormLabel>Username</FormLabel>
              <Input 
							name="username" 
							ref={register({
								required: "Username Required",
								minLength: {
									message: "Username requires 5-20 characters",
									value: 5,
								},
							})} 
							/>
							<FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
							<FormHelperText>Username requires 5-20 characters</FormHelperText>
            </FormControl>

						<FormControl id="birthday" isInvalid={errors.birthday && errors.birthday.type === "required"}>
              <FormLabel>Birthday</FormLabel>
              <Controller
								as={<Flatpickr name="birthday" className="chakra-input css-n9lnwn"/>}
								value={date}
								onChange={(date: Date) => setDate(date)}
								name="birthday"
								control={control}
								className="chakra-input css-n9lnwn"
								defaultValue={new Date}
							/>
							<FormErrorMessage>Birthday Required</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
							<InputGroup size="md">
								<Input 
								name="password" 
								ref={register({
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password requires 8-20 characters"
									},
									pattern: {
										value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[a-zA-Z0-9]{8,20}$/,
										message: "Password needs an uppercase letter, a lowercase letter, and a number"
									}
								})} 
								type={show ? "text" : "password"}/>
								<InputRightElement width="4.5rem">
									<Button h="1.75rem" size="sm" onClick={handleClick}>
										{show ? "Hide" : "Show"}
									</Button>
								</InputRightElement>
							</InputGroup>
							<FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>		
							<FormHelperText>Password requires 8-20 characters, an uppercase letter, a lowercase letter, and a number</FormHelperText>
            </FormControl>

						<FormControl id="repeatpassword" isInvalid={errors.repeatpassword}>
              <FormLabel>Repeat Password</FormLabel>
							<InputGroup size="md">
								<Input 
								name="repeatpassword"
								type="password"
								ref={register({
									required: "Repeat Password is required",
									validate: value =>
									value === password.current || "The passwords do not match"
								})}
								/>
								<InputRightElement width="4.5rem">
									<Button h="1.75rem" size="sm" onClick={handleClick1}>
										{show1 ? "Hide" : "Show"}
									</Button>
								</InputRightElement>
							</InputGroup>
							<FormErrorMessage>{errors.repeatpassword && errors.repeatpassword.message}</FormErrorMessage>
            </FormControl>

						<FormControl id="challengeQuestion" isInvalid={errors.challengeQuestion && errors.challengeQuestion.type === "required"}>
              <FormLabel>Challenge Questions</FormLabel>
              <Select name="challengeQuestion" placeholder="--Pick your Question--" ref={register({required:true})}>
								{challengeQuestions && challengeQuestions.map((challengeQuestion) => {
									return (<option value={challengeQuestion._id} key={challengeQuestion.question}>{challengeQuestion.question}</option>);
								})}
							</Select>
							<FormErrorMessage>Challenge Questions Required</FormErrorMessage>
            </FormControl>

						<FormControl id="answer" isInvalid={errors.answer && errors.answer.type === "required"}>
              <FormLabel>Answer</FormLabel>
              <Input name="answer" ref={register({required:true})} />
							<FormErrorMessage>Answer Required</FormErrorMessage>
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
                Sign up
              </Button>
            </Stack>
          </Stack>
				</form>	
        </Box>
      </Stack>: <PageLoader size="xl"/>}
			<ModalComp isModalOpen={isOpenError} onModalClose={onCloseError} title="Registration Error">
				{errorMessage}
			</ModalComp>
	</Layout>
	{!isLoading && <Footer />}
		</>
	);
}

export default Register;