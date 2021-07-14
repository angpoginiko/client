import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
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
	Text,
	useDisclosure
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { useQuery } from 'react-query';
import { Answer, ChallengeQuestionAnswer } from '../interfaces';
import PageLoader from './PageLoader';

interface AnswerChallengeQuestionProps {
	onOpen: () => void;
	modalClose: () => void;
	customerId: string;
}

export default function AnswerChallengeQuestion({ modalClose, customerId, onOpen } : AnswerChallengeQuestionProps) {
	const [errorText, setErrorText] = useState("")
	const {isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();

	const fetchChallengeQuestion = async () => {
		const res = await fetch(`api/challengeQuestion/${customerId}`);
		return res.json();
	}
	const { data: challengeQuestionAnswer, isFetching } = useQuery<ChallengeQuestionAnswer>("challengeQuestionAnswer", fetchChallengeQuestion);
	const onSubmit = async (formData: Answer) => {
		if(formData.answer === challengeQuestionAnswer?.answer){
			onOpen();
			modalClose();
		} else {
			setErrorText("Wrong Answer");
			onErrorOpen();
		}
	}
	return(
		<>
      {isFetching ? <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Add Product Family</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="answer" isInvalid={errors.answer && errors.answer.type === "required"}>
              <FormLabel>{challengeQuestionAnswer?.challengeQuestion.question}</FormLabel>
              <Input name="answer" ref={register({required:true})} />
							<FormErrorMessage>Answer Required</FormErrorMessage>
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
                Submit
              </Button>
            </Stack>
          </Stack>
				</form>	
        </Box>
      </Stack> : <PageLoader size="xl"/>}
			<ModalComp isModalOpen={isErrorOpen} onModalClose={onErrorClose} title="Error!">
				<Text>
					{errorText}
				</Text>
			</ModalComp>
		</>
	);
}