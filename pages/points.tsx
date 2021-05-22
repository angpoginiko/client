import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import {
  Box,
  Container,
  Text,
  VStack,
	Center,
	SimpleGrid,
	HStack,
	Button,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config'
import { Point } from '../interfaces/index'
import { useRouter } from 'next/router'
import userRoles from '../constants/userRoles';


export default function Points({points, user} : any) {
	const router = useRouter();
	const earned = points.earned as Array<Point>;
	const redeemed = points.redeemed as Array<number>;
	let totalEarnedPoints = 0;
	let totalExpiredPoints = 0;
	let totalAvailablePoints = 0;
	let totalRedeemedPoints = 0;

	if(earned.length >= 0){
		const earnedPoints = earned.map((points) => {
			return points.points;
		})
		totalEarnedPoints = earnedPoints.reduce((a,b) => a + b, 0);
	}
	earned.map((points) => {
		if(new Date() >= new Date(points.expiryDate)){
			totalExpiredPoints += points.points;
		} else {
			totalAvailablePoints += points.points;
		}
	});
	
	redeemed.length === 0 ? totalRedeemedPoints = 0 : redeemed.map((points) => {
		totalRedeemedPoints += points;
	});
	
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Admin == user.userRole){
			router.replace('/HomeAdmin')
		}
	}, [user])
  return (
    <>
		<Layout authentication={user}>
			<VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
				<Box w="100%" h={{ base: "100px", md: "150px", lg: "200px" }} bg="#36B290">
					<Center>
						<VStack spacing="0">
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }} color="white">
								REWARDS
							</Text>
							<HStack>
								<Text fontSize={{ base: "30px", md: "55px", lg: "75px" }} color="white">
									{totalAvailablePoints}
								</Text>
								<Text fontSize={{ base: "15px", md: "25px", lg: "30px" }} color="white">available points</Text>
							</HStack>
						</VStack>
					</Center>
				</Box>
				
				<Box w="100%" h="800px">
					<Center>
						<SimpleGrid gap={{ base: "35px", md: "50px", lg: "100px" }} columns={[1, null, 2]}>
							<Container>
								<Box w={{ base: "200px", md: "300px", lg: "400px", xl: "515px" }} h="98px" bg="#36B290">
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>{totalEarnedPoints}</Text></Center>
								</Box>
								<Center><Text>Earned Points</Text></Center>
							</Container>

							<Container>
								<Box w={{ base: "200px", md: "300px", lg: "400px", xl: "515px" }} h="98px" bg="#36B290" >
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>{totalExpiredPoints}</Text></Center>
								</Box>
								<Center>
									<Text>Expired Points</Text>
								</Center>
							</Container>

							<Container>
								<Box w={{ base: "200px", md: "300px", lg: "400px", xl: "515px" }} h="98px" bg="#36B290">
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>{totalRedeemedPoints}</Text></Center>
								</Box>
								<Center>
									<Text>Redeemed Points</Text>
								</Center>
							</Container>

							<Container>
								<Box w={{ base: "200px", md: "300px", lg: "400px", xl: "515px" }} h="98px" bg="#36B290">
									<Center><Text fontSize={{ base: "20px", md: "45px", lg: "65px" }}>{totalEarnedPoints}</Text></Center>
								</Box>
								<Center>
									<Text>Enchased Points</Text>
								</Center>
							</Container>
						</SimpleGrid>
					</Center>
				</Box>
			</VStack>
		</Layout>
    </>
  );
}


Points.getInitialProps = async (ctx: NextPageContext) => {
  const points = await frontEndAuthentication(`${server}/api/points/getPoints`, ctx);
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return { points, user }
}
