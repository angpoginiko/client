import React, { useState } from 'react'
import {
    Flex
} from '@chakra-ui/react'
import NavItem from './NavItem'
import { useQuery } from 'react-query';
import { ProductTypeType } from '../interfaces';

interface SideBarProps {
	setQuery: (query: string) => void;
}

export default function Sidebar({setQuery} : SideBarProps) {
    const [navSize, changeNavSize] = useState("large");
		const fetchProductTypes = async () => {
			const res = await fetch(`api/productType/getProductTypes`);
			return res.json();
		}
		const { data: productTypes } = useQuery<ProductTypeType[]>("productTypes", fetchProductTypes);

    return (
        <Flex
            pos="sticky"
            left="5"
            h="100%"
            marginTop="2.5vh"
            borderRadius={navSize == "small" ? "15px" : "30px"}
            w={"10%"}
            flexDir="column"
            justifyContent="space-between"
        >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                as="nav"
            >
							{productTypes && productTypes.map((productType) => {
								 return(
									<NavItem 
										key={productType._id!} 
										navSize={navSize} 
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