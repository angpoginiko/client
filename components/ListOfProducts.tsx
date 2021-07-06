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
import ModalComp from './ModalComp';
import AddProductType from './AddProductType';
import CreateProduct from './CreateProduct';
import AddUnitOfMeasure from './AddUnitOfMeasure';
import { MdMenu } from 'react-icons/md';

interface ListOfProductsProps {
	products?: ProductType[];
	refetchProducts: () => void;
	refetchReceiving: () => void;
}

export default function ListOfProducts({products, refetchProducts, refetchReceiving}: ListOfProductsProps) {
	const {isOpen , onOpen, onClose} = useDisclosure();
	const {isOpen: isProductTypeOpen , onOpen: onProductTypeOpen, onClose: onProductTypeClose} = useDisclosure();
	const {isOpen: isUnitOfMeasureOpen , onOpen: onUnitOfMeasureOpen, onClose: onUnitOfMeasureClose} = useDisclosure();
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
							<MenuItem onClick={()=>onUnitOfMeasureOpen()}>Add Unit of Measure</MenuItem>
							<MenuItem onClick={()=>onProductTypeOpen()}>Add Product Family</MenuItem>
						</MenuList>
					</Menu>
					</Th>
					<Th>Name</Th>
					<Th>Product Family</Th>
					<Th>Unit of Measure</Th>
					<Th>Price per Unit of Measure</Th>
					<Th>Minimum Storage Stock</Th>
					<Th>Minimum Display Stock</Th>
					<Th>Maximum Display Capacity</Th>
					<Th>Options</Th>
				</Tr>
			</Thead>
			<Tbody>
			{products && products.map((items: ProductType) => {
					return(
						<ProductList product={items} key={items._id} refetchProducts={refetchProducts} refetchReceiving={refetchReceiving}/>
					)
				})}
			</Tbody>
		</Table>

		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
			<CreateProduct modalClose={onClose} refresh={refetchProducts}/>
		</ModalComp>

		<ModalComp isModalOpen={isUnitOfMeasureOpen} onModalClose={onUnitOfMeasureClose} title="">
			<AddUnitOfMeasure refresh={refetchProducts} modalClose={onUnitOfMeasureClose}/>
		</ModalComp>

		<ModalComp isModalOpen={isProductTypeOpen} onModalClose={onProductTypeClose} title="">
			<AddProductType modalClose={onProductTypeClose} refresh={refetchProducts}/>
		</ModalComp>
	</Box>

	
  );
}