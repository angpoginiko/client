import React, { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import { MdShoppingCart,MdAddShoppingCart } from "react-icons/md";
import Head from 'next/head';
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
	Icon,
	useDisclosure
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import ModalComp from './ModalComp';
import { User } from '../interfaces';

const ProductQRScanner = dynamic(() => import('../components/ProductQRScanner'), {
	ssr: false,
});

type Props = {
  children?: ReactNode
  title?: string
	authentication?: User
	isModalOpen?: boolean;
	onModalClose?: () => void;
	frontPageClick?: boolean;
}


const Layout = ({ children, title = 'Home', authentication, isModalOpen, onModalClose, frontPageClick }: Props) => {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const Router = useRouter();
	const [auth, setAuth] = useState(!!authentication);


	const onLogout = async () =>{ 
		await fetch("api/profile/logout",{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		})
		await Router.push("/")
		setAuth(false);
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
							''
						}
					/>
				</MenuButton>
				<MenuList>
					<MenuItem><Link href="/profile">Profile</Link></MenuItem>
					<MenuItem><Link href="/points">Rewards</Link></MenuItem>
					<MenuItem><Link href="/purchaseHistory">Purchase History</Link></MenuItem>
					<MenuDivider />
					<MenuItem><Link onClick={onLogout}>Logout</Link></MenuItem>
				</MenuList>
			</Menu>
		</>
	);
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
							href={auth ? '/Home' : '/'}>
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
						<Button href="#" onClick={() => auth ? Router.push('/cart') : Router.push('/login')}><Icon as={MdShoppingCart} w={4} h={4}/></Button>
						<Button href="#" onClick={() => auth ? onOpen() : Router.push('/login')}><Icon as={MdAddShoppingCart} w={4} h={4}/></Button>
						<ModalComp isModalOpen={isOpen || isModalOpen!} onModalClose={() => {frontPageClick ? onModalClose!() : onClose()}} title="Scan Item"><ProductQRScanner customerId={authentication?.id!}/></ModalComp>
						{auth ? logoutButton: loginButton}
					</Stack>
				</Flex>
			</Flex>
		</Box>

		{children}
	</>
)}

export default Layout