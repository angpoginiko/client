import React from 'react';
import { useForm } from 'react-hook-form'
import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  Button,
  Heading,
  useColorModeValue,
	FormErrorMessage,
	useDisclosure,
	NumberIncrementStepper,
	NumberInputStepper,
	NumberInput,
	NumberDecrementStepper,
	NumberInputField
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { Point } from '../interfaces';

interface SetPointVariableProps {
	onModalClose: () => void;
}

export default function SetPointVariable({ onModalClose } : SetPointVariableProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();

	const onSubmit = async (points: Point) => {
		const response = await fetch("/api/points/setPointVariable", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({points: points.points})
		});
		await response.json();
		onOpen();
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Set Point Variable</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="points" isInvalid={errors.points && errors.points.type === "required"}>
              <FormLabel>Set Points</FormLabel>
							<NumberInput>
								<NumberInputField name="points" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Points Required</FormErrorMessage>
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
			<ModalComp isModalOpen={isOpen} onModalClose={() => {onClose(), onModalClose()}} title="Add Cashier">
				Point Variable Changed!!!
			</ModalComp>
		</>
	);
}