import React, { useState } from 'react'
import {
    Flex,
		Divider,
		IconButton,
		HStack,
		Text,
		Icon,
		useMediaQuery
} from '@chakra-ui/react'
import NavItem from './NavItem'
import { useQuery } from 'react-query';
import { ProductTypeType } from '../interfaces';
import { FiMenu } from "react-icons/fi";


interface SideBarProps {
	setQuery: (query: string) => void;
}

export default function Sidebar({setQuery} : SideBarProps) {
	const fetchProductTypes = async () => {
		const res = await fetch(`api/productType/getProductTypes`);
		return res.json();
	}
	const { data: productTypes } = useQuery<ProductTypeType[]>("productTypes", fetchProductTypes);
	const [isSmall] = useMediaQuery("(min-width: 48em)")
	return (
		<>
			{isSmall ? 
				<MainNav productTypes={productTypes} setQuery={setQuery}/>
			: <MobileNav productTypes={productTypes} setQuery={setQuery}/>}
		</>
	)
}

interface NavProps {
	productTypes: ProductTypeType[] | undefined;
	setQuery: (query: string) => void;
}

const MainNav = ({productTypes, setQuery} : NavProps) => {
	return(
		<Flex
			pos="sticky"
			left="5"
			h="100%"
			marginTop="2.5vh"
			borderRadius={"30px"}
			w="20%"
			flexDir="column"
			justifyContent="space-between"
			marginRight="20px"
		>
			<Flex
				p="5%"
				flexDir="column"
				w="100%"
				alignItems={"flex-start"}
				as="nav"
			>
				Product List
					{productTypes && productTypes.map((productType) => {
							return(
							<NavItem 
								key={productType._id!} 
								title={productType.name} 
								setQuery={setQuery} 
								typeId={productType._id!}
							/>
							)
					})}
				</Flex>
			</Flex> 
	)
}

const MobileNav = ({productTypes, setQuery} : NavProps) => {
	const [navSizeClose, setNavSize] = useState(true);
	return (
		<Flex
				pos="sticky"
				left="5"
				h="100%"
				marginTop="2.5vh"
				borderRadius={"30px"}
				w={navSizeClose ? "2em": "25%"}
				flexDir="column"
				justifyContent="space-between"
		>
				<Flex
						p="5%"
						flexDir="column"
						w="100%"
						alignItems={"flex-start"}
						as="nav"
				>
					<HStack>	
						<IconButton
							background="none"
							icon={<Icon as={FiMenu} boxSize="1.5em"/>}
							aria-label="menu"
							onClick={() => setNavSize(!navSizeClose)}
						/>
						<Text fontSize={{base: "xs", md: "md"}} align={"center"} display={navSizeClose ? "none" : "flex"}>
							Product List
						</Text>
					</HStack>
					<Divider display={navSizeClose ? "none" : "flex"}/>
					{productTypes && productTypes.map((productType) => {
						 return(
							<NavItem 
								key={productType._id!} 
								title={productType.name} 
								setQuery={setQuery} 
								typeId={productType._id!}
								navSizeClose={navSizeClose}
							/>
						 )
					})}
					 
				</Flex>
		</Flex>
)
}