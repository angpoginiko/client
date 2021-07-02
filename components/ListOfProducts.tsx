import React from 'react'
import {
	Thead,
	Table,
	Th,
	Tr,
	Tbody,
	useDisclosure,
	Menu,
  MenuButton,
  MenuList,
  MenuItem,
	Box,
	IconButton 
} from '@chakra-ui/react';
import { ProductType } from '../interfaces';
import ProductList from './ProductList';
import { useQuery } from 'react-query';
import AddProduct from './AddProduct';
import ModalComp from './ModalComp';
import AddProductType from './AddProductType';
import CreateProduct from './CreateProduct';
import AddUnitOfMeasure from './AddUnitOfMeasure';
import { MdMenu } from 'react-icons/md';


export default function ListOfProducts() {
	const {isOpen , onOpen, onClose} = useDisclosure();
	const {isOpen: isAddProductOpen , onOpen: onAddProductOpen, onClose: onAddProductClose} = useDisclosure();
	const {isOpen: isProductTypeOpen , onOpen: onProductTypeOpen, onClose: onProductTypeClose} = useDisclosure();
	const {isOpen: isUnitOfMeasureOpen , onOpen: onUnitOfMeasureOpen, onClose: onUnitOfMeasureClose} = useDisclosure();
	const fetchCart = async () => {
		const res = await fetch("api/products/getProducts");
		return res.json();
	}
	const { data: products, refetch } = useQuery<ProductType[]>("product", fetchCart);
  return (
		<Box spacing="0" >
		<Table>
			<Thead>
				<Tr>
					<Th>
					<Menu>
						<MenuButton 
							as={IconButton}
							aria-label="Options"
							icon={<MdMenu />}
							variant="outline"
						/>
						<MenuList>
							<MenuItem onClick={()=>onOpen()}>Create Product</MenuItem>
							<MenuItem onClick={()=>onAddProductOpen()}>Add Product</MenuItem>
							<MenuItem onClick={()=>onUnitOfMeasureOpen()}>Add Unit of Measure</MenuItem>
							<MenuItem onClick={()=>onProductTypeOpen()}>Add Product Family</MenuItem>
						</MenuList>
					</Menu>
					</Th>
					<Th>Name:</Th>
					<Th>Product Family</Th>
					<Th>Unit of Measure</Th>
					<Th>Price per unit of measure</Th>
					<Th>Minimum Stock</Th>
					<Th>Add Product</Th>
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

		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
			<CreateProduct modalClose={onClose} refresh={refetch}/>
		</ModalComp>

		<ModalComp isModalOpen={isAddProductOpen} onModalClose={onAddProductClose} title="">
			<AddProduct modalClose={onClose} refresh={refetch}/>
		</ModalComp>

		<ModalComp isModalOpen={isUnitOfMeasureOpen} onModalClose={onUnitOfMeasureClose} title="">
			<AddUnitOfMeasure refresh={refetch} modalClose={onUnitOfMeasureClose}/>
		</ModalComp>

		<ModalComp isModalOpen={isProductTypeOpen} onModalClose={onProductTypeClose} title="">
			<AddProductType modalClose={onProductTypeClose} refresh={refetch}/>
		</ModalComp>
	</Box>

	
  );
}