import React from 'react'
import {
    Flex,
    Text,
    Link,
    Menu,
    MenuButton,
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
                <Link
                    p={3}
                    borderRadius={8}
                    _hover={{ textDecor: 'none', backgroundColor: "#AEC8CA" }}
                    w={"100%"}
                >
                    <MenuButton w="100%" onClick={() => setQuery(typeId)}>
                        <Flex>
                            <Text ml={5} display={"flex"}>{toPascalCase(title)}</Text>
                        </Flex>
                    </MenuButton>
                </Link>
            </Menu>
        </Flex>
    )
}