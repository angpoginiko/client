import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';
import {
  Box,
  Flex,
  HStack,
  useColorModeValue,
  Stack,
	Link,
} from '@chakra-ui/react';

type Props = {
  children?: ReactNode
  title?: string
	authentication?: string
}

const AdminNavBar = ({ children, title = 'Home' }: Props) => {
	const Router = useRouter();
	const onLogout = async () =>{ 
		await fetch("api/profile/logout",{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		})
		await Router.push("/")
	}
	
	return(
		<>
		<Head>
			<title>{title}</title>
		</Head>
		<Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
			<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
				<HStack spacing={8} alignItems={'center'}>
					<Box>Logo</Box>
					<HStack
						as={'nav'}
						spacing={4}
						display={{ base: 'none', md: 'flex' }}>
						<Link
							px={2}
							py={1}
							rounded={'md'}
							_hover={{
								textDecoration: 'none',
								bg: useColorModeValue('gray.200', 'gray.700'),
							}}
							href="/HomeAdmin">
							Home
						</Link>
					</HStack>
				</HStack>
				<Flex alignItems={'center'}>
					<Stack
					flex={{ base: 1, md: 0 }}
					justify={'flex-end'}
					direction={'row'}
					spacing={6}>
						<Link onClick={onLogout}>Logout</Link>
					</Stack>
				</Flex>
			</Flex>
		</Box>

		{children}
	</>
)}

export default AdminNavBar