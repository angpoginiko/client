import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { MdShoppingCart } from "react-icons/md";

import {
	Avatar,
  Box,
  Flex,
  HStack,
  Button,
  useColorModeValue,
  Stack,
	Link,
	Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
	Icon
} from '@chakra-ui/react';


type Props = {
  children?: ReactNode
  title?: string
	auth?: boolean
}

const Layout = ({ children, title = 'This is the default title', auth }: Props) => {
	const Router = useRouter();

	const onLogout = async () =>{ 
		await fetch("api/profile/logout",{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		})
		await Router.push("/login")
	}

	const loginButton = (
		<>
			<Button
					as={'a'}
					fontSize={'sm'}
					fontWeight={400}
					variant={'link'}
					href="/login">
					Sign In
				</Button>
				<Button
					as={'a'}
					fontSize={'sm'}
					fontWeight={400}
					variant={'link'}
					href="/register">
					Sign Up
				</Button>
		</>
	);

	const logoutButton = (
		<>
			<Menu>
				<MenuButton
					as={Button}
					rounded={'full'}
					variant={'link'}
					cursor={'pointer'}>
					<Avatar
						size={'sm'}
						src={
							'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
						}
					/>
				</MenuButton>
				<MenuList>
					<MenuItem>Link 1</MenuItem>
					<MenuItem>Link 2</MenuItem>
					<MenuDivider />
					<MenuItem><Link onClick={onLogout}>Logout</Link></MenuItem>
				</MenuList>
			</Menu>
		</>
	)
	
	return(
		<>
		<head>
			<title>{title}</title>
		</head>
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
							href="/">
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
						<a href="#"><Icon as={MdShoppingCart} /></a>
						{auth ? logoutButton: loginButton}
					</Stack>
				</Flex>
			</Flex>
		</Box>

		<Box p={4}>{children}</Box>
	</>
)}

export default Layout