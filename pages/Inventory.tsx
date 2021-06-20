import React, { useEffect } from 'react'
import {
  Box,
  Text,
  VStack,
	Center,
	Thead,
	Table,
	Th,
	Tr,
	Tbody,
	Button,
	HStack,
	useDisclosure
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { frontEndAuthentication } from './api/frontEndAuthentication';
import { server } from '../config'
import { useRouter } from 'next/router'
import userRoles from '../constants/userRoles';
import { ProductType } from '../interfaces';
import ProductList from '../components/ProductList';
import ModalComp from '../components/ModalComp';
import AddProduct from '../components/AddProduct';
import AddProductType from '../components/AddProductType';
import { useQuery } from 'react-query';
import AdminNavBar from '../components/AdminNavBar';


export default function Points({user} : any) {
	const {isOpen , onOpen, onClose} = useDisclosure();
	const {isOpen: isProductTypeOpen , onOpen: onProductTypeOpen, onClose: onProductTypeClose} = useDisclosure();
	const router = useRouter();
	useEffect(() => {
		if(userRoles.Cashier == user.userRole){
			router.replace('/HomeCashier')
		} else if(userRoles.Customer == user.userRole){
			router.replace('/Home')
		}
	}, []);

	const fetchCart = async () => {
		const res = await fetch("api/products/getProducts");
		return res.json();
	}
	
	
	const { data: products, refetch } = useQuery<ProductType[]>("product", fetchCart);
  return (
    <>
		<AdminNavBar authentication={user}>
				<Box w="100%" height="100%" bg="#36B290">
					<Center>
						<VStack spacing="0">
							<Text fontSize={{ base: "20px", md: "45px", lg: "65px" }} color="white">
								INVENTORY
							</Text>
							<Table>
								<Thead>
									<Tr>
										<Th>Name:</Th>
										<Th>Quantity</Th>
										<Th>Price</Th>
										<Th>Product Type</Th>
										<Th>Options</Th>
									</Tr>
								</Thead>
								<Tbody>
								{products && products.map((items: ProductType) => {
										return(
												<ProductList product={items} key={items._id} refetch={refetch}/>
										)
									})}
								</Tbody>
							</Table>

							<HStack>
								<Button onClick={()=>onOpen()}>
									Add Product
								</Button>
								<Button onClick={()=>onProductTypeOpen()}>
									Add Product Type
								</Button>
							</HStack>
						</VStack>
					</Center>
				</Box>
		</AdminNavBar>
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="Add Product">
			<AddProduct modalClose={onClose} refresh={refetch}/>
		</ModalComp>
		<ModalComp isModalOpen={isProductTypeOpen} onModalClose={onProductTypeClose} title="Add Product Type">
			<AddProductType modalClose={onProductTypeClose} refresh={refetch}/>
		</ModalComp>
    </>
  );
}


Points.getInitialProps = async (ctx: NextPageContext) => {
	const user = await frontEndAuthentication(`${server}/api/profile/retrieve`, ctx);
	return { user }
}