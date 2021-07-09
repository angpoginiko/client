import React from 'react'
import {
    Flex,
    Text,
    Link,
    Menu,
} from '@chakra-ui/react'
import useCase from '../hooks/useCase';

interface NavItemProps {
	title: string;
	typeId: string;
	setQuery: (query: string) => void;
}

export default function NavItem({ title, typeId, setQuery }: NavItemProps) {
	const { toPascalCase } = useCase();
    return (
        <Flex
            mt={30}
            flexDir="column"
            w="100%"
            alignItems={"flex-start"}
        >
            <Menu placement="right">
                <Link onClick={() => setQuery(typeId)}>
									<Text ml={5} display={"flex"}>{toPascalCase(title)}</Text>
                </Link>
            </Menu>
        </Flex>
    )
}