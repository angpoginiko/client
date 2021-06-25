import React from 'react'
import {
    Flex,
    Text,
    Link,
    Menu,
    MenuButton,
} from '@chakra-ui/react'

interface NavItemProps {
	title: string;
	navSize: string;
	typeId: string;
	setQuery: (query: string) => void;
}

export default function NavItem({ title, navSize, typeId, setQuery }: NavItemProps) {
    return (
        <Flex
            mt={30}
            flexDir="column"
            w="100%"
            alignItems={navSize == "small" ? "center" : "flex-start"}
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
                            <Text ml={5} display={navSize == "small" ? "none" : "flex"}>{title}</Text>
                        </Flex>
                    </MenuButton>
                </Link>
            </Menu>
        </Flex>
    )
}