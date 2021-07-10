import {
  Box,
  Text,
  VStack,
	Center,
	Button,
	useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { CartProductType, Points } from '../interfaces';
import CheckoutItem from './CheckoutItem'
import QRGenerator from './QRGenerator'
import ModalComp from './ModalComp'
import Encashment from './Encashment'
import { useQuery } from 'react-query';

interface CheckoutProductProps {
	cart : CartProductType[];
	orderId: string;
	totalPrice: number;
	isProfileComplete: boolean;
	customerId: string;
}

export default function CheckoutItems(
	{
		cart, 
		orderId, 
		totalPrice, 
		isProfileComplete, 
		customerId
	} : CheckoutProductProps) {
	const [isCreated, setIsCreated] = useState(true);
	const { onOpen: encashedPointsOpen, isOpen: isEncashedPointsOpen, onClose: encashedPointsClose } = useDisclosure();
	const fetchPoints = async () => {
		const res = await fetch(`api/points/point/${customerId}`);
		return res.json();
	}
	const { data: points, isFetching } = useQuery<Points>("points", fetchPoints);
	const earned = points?.earned;
	const encashed = points?.encashed;
	let earnedPoints = 0;
	let totalEncashedPoints = 0;

	earned?.map((points) => {
		if(new Date() < new Date(points.expiryDate!)){
			earnedPoints += points.points;
		} 
		encashed?.map((encashed) => {
			if(new Date() < new Date(points.expiryDate!)){
				totalEncashedPoints += encashed.points
			} 
		});
	});
	const totalAvailablePoints = earnedPoints - totalEncashedPoints;
  return (
    <>
			<VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
				{isCreated && 
				(
				<>
						<Box></Box>
						<Center>
							<VStack w="100%" h="100%">
								{cart?.length ? cart.map((userCart) => {
									return(
											<div key={userCart.productId?.toString()}>
													<CheckoutItem userCart={userCart}/>
											</div>
										);
								}):
									(<Text>
										You have no item on your Checkout
									</Text>
										)
								}
							</VStack>
						</Center>
					</>)
				}
				<Center boxSize="100%">
					<VStack>
						<Text>Total: {totalPrice}</Text>
						{isCreated && (
							<Button onClick={encashedPointsOpen} disabled={!isProfileComplete || (totalAvailablePoints <= 0)}>
								Use Points
							</Button>
						)}
						<QRGenerator text={orderId} buttonName="Generate Checkout QR" isCreated={isCreated} setIsCreated={setIsCreated}/>
					</VStack>
				</Center>
			</VStack>
			<ModalComp isModalOpen={isEncashedPointsOpen} onModalClose={encashedPointsClose} title="Redeem Points">
				<Encashment 
					customerId={customerId} 
					onModalClose={encashedPointsClose} 
					availablePoints={earnedPoints} 
					totalEncashedPoints={totalEncashedPoints}
					isFetching={isFetching}
				/>
			</ModalComp>
    </>
  );
}