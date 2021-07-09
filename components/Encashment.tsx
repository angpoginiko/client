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
	NumberInputField, 
	Text
} from '@chakra-ui/react';
import ModalComp from './ModalComp';
import { Point, Points } from '../interfaces';



interface EncashmentProps {
	refresh?: () => void;
	customerId: string | undefined;
	onModalClose: () => void;
	availablePoints: number;
	totalEncashedPoints: number;
}

export default function Encashment({ customerId, onModalClose, availablePoints, totalEncashedPoints, refresh } : EncashmentProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {isOpen: isOpenError, onOpen: onOpenError, onClose: onCloseError} = useDisclosure();
	const { register, handleSubmit, errors } = useForm();
	
	const totalAvailablePoints = availablePoints - totalEncashedPoints;
	const onSubmit = async (pointsUsed: Point) => {
		if(pointsUsed.points > totalAvailablePoints){
			onOpenError();
		} else {
			const point = pointsUsed.points;
			const response = await fetch (`/api/orders/addPoints`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: 'include',
				body: JSON.stringify({point: point, id: customerId}),
			});
			if(response.ok){
				onOpen();
			}
		}
	}
	return(
		<>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Encash Points</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
				<form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="points" isInvalid={errors.points && errors.points.type === "required"}>
              <FormLabel>Points to be Used:</FormLabel>
							<NumberInput>
								<NumberInputField name="points" ref={register({required:true})}/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<FormErrorMessage>Points Required</FormErrorMessage>
            </FormControl>
						<Text>
							Available Points: {totalAvailablePoints && totalAvailablePoints.toFixed(2)}
						</Text>
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
				Points Encashed!!
			</ModalComp>
			<ModalComp isModalOpen={isOpenError} onModalClose={onCloseError} title="Add Cashier">
				Points Redeem is higher than available points
			</ModalComp>
		</>
	);
}