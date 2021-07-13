import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import {
  Box,
  Text,
  VStack,
	Center,
	Circle,
	Wrap,
	WrapItem,
	Stack
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config'
import { EncashedPoints, Point } from '../interfaces/index'
import { useRouter } from 'next/router'
import userRoles from '../constants/userRoles';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';


export default function Points({points, user, profile, onStore} : any) {
	const [isLoading, setIsLoading] = useState(false);

	const isProfileComplete = Boolean(profile?.email && profile.gender 	&& profile.mobilenumber && profile.tin && profile.address);
	if(!isProfileComplete) {
		return <Layout authentication={user} title="Points" onStore={onStore} setIsLoading={setIsLoading}>
			You need to complete profile first
		</Layout>
	}

	const router = useRouter();
	const earned = points.earned as Array<Point>;
	const encashed = points.encashed as Array<EncashedPoints>;
	let totalEarnedPoints = 0;
	let totalExpiredPoints = 0;
	let totalAvailablePoints = 0;
	let availablePoints = 0;
	let totalEncashedPoints = 0;

	if(earned.length >= 0){
		const earnedPoints = earned.map((points) => {
			return points.points;
		})
		totalEarnedPoints = earnedPoints.reduce((a,b) => a + b, 0);
	}
	earned.map((points) => {
		if(new Date() >= new Date(points.expiryDate!)){
			totalExpiredPoints += points.points;
		} else {
			availablePoints += points.points;
		}
		encashed?.map((encashed) => {
			if(new Date() < new Date(points.expiryDate!)){
				totalEncashedPoints += encashed.points;
			} 
		});
	});

	totalAvailablePoints = availablePoints - totalEncashedPoints;
	
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/home-cashier');
		} else if(userRoles.Admin == user.userRole){
			router.replace('/home-admin');
		}
	}, [user, onStore]);
  return (
    <>
		<Layout authentication={user} title="Points" onStore={onStore} setIsLoading={setIsLoading}>
			{!isLoading ? <VStack spacing={{ base: "35px", md: "50px", lg: "100px" }}>
				<Box w="100%" h="100%" bg="#36B290">
					<Center>
						<VStack spacing="0">
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }} color="white">
								REWARDS
							</Text>	
						</VStack>
					</Center>
				</Box>
				<Stack spacing="25px">
					<Box w="100%" h="100%">
						<Center>
							<Wrap spacing={{ base: "35px", md: "50px", lg: "120px" }} justify="center">
								<WrapItem>
									<VStack>
										<Circle size={{ base: "100px", md: "200px", lg: "300px" }} bg="#36B290">
											<Center><Text fontSize={{ base: "40px", md: "60px", lg: "100px" }}>{totalEarnedPoints ? totalEarnedPoints.toFixed(2) : totalEarnedPoints}</Text></Center>
										</Circle>
										<Center><Text>Earned Points</Text></Center>
									</VStack>
								</WrapItem>

								<WrapItem>
									<VStack>
										<Circle size={{ base: "100px", md: "200px", lg: "300px" }} bg="#36B290" >
											<Center><Text fontSize={{ base: "40px", md: "60px", lg: "100px" }}>{totalExpiredPoints}</Text></Center>
										</Circle>
										<Center>
											<Text>Expired Points</Text>
										</Center>
									</VStack>
								</WrapItem>

								<WrapItem>
									<VStack>
										<Circle size={{ base: "100px", md: "200px", lg: "300px" }} bg="#36B290">
											<Center><Text fontSize={{ base: "40px", md: "60px", lg: "100px" }}>{totalEncashedPoints}</Text></Center>
										</Circle>
										<Center>
											<Text>Used Points</Text>
										</Center>
									</VStack>
								</WrapItem>
							</Wrap>
						</Center>
					</Box>
					<Box>
						<VStack>
							<Circle size={{ base: "100px", md: "200px", lg: "300px" }} bg="#36B290">
								<Center><Text fontSize={{ base: "40px", md: "60px", lg: "100px" }}>{totalAvailablePoints ? totalAvailablePoints.toFixed(2) : totalAvailablePoints}</Text></Center>
							</Circle>
							<Center>
								<Text fontSize={{ base: "15px", md: "25px", lg: "30px" }} >Available Points</Text>
							</Center>
						</VStack>
					</Box>
				</Stack>
			</VStack> : <PageLoader size="xl"/>}
		</Layout>
		{!isLoading && <Footer />}
    </>
  );
}


Points.getInitialProps = async (ctx: NextPageContext) => {
  const points = await frontEndAuthentication(`${server}/api/points/getPoints`, ctx);
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	const profile = await frontEndAuthentication(`${server}/api/profile/GetUser`, ctx);
	const onStore = await frontEndAuthentication(`${server}/api/profile/${user.id}`, ctx);
	return { points, user, profile, onStore }
}
