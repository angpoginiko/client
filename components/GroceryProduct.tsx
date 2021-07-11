import { UserList } from "../interfaces";
import {
  Box,
  Text,
	Image,
	HStack,
	VStack,
	Icon,
	Center,
	Button,
	Flex,
	useDisclosure,
	GridItem
} from '@chakra-ui/react';
import { MdAddBox, MdDelete, MdRemove } from "react-icons/md";
import { useEffect, useState } from "react";
import ModalComp from "./ModalComp";
import SetListQuantity from "./SetListQuantity";
import useDebounce from "../hooks/useDebounce";

interface GroceryProductProps{
	userList: UserList;
	user: string;
	refetch: () => void;
	onStore: boolean;
	customerId: string;
}

export default function GroceryProduct ({ userList, user, refetch, onStore, customerId } : GroceryProductProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isToCartOpen, onOpen: onToCartOpen, onClose: onToCartClose } = useDisclosure();
	const [quantity, setQuantity] = useState(userList.product.quantity);
	const increamentQuantity = () => {
		setQuantity(prevQuantity => prevQuantity + 1);
	}

	const decrementQuantity = () => {
		if(quantity != 1) {
			setQuantity(prevQuantity => prevQuantity - 1);
		} else {
			setQuantity(1);
		}
	}

	const handleDelete = async (productId: string | undefined) => {
    if (productId){
				await fetch (`/api/list/lists/${user}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: 'include',
					body: JSON.stringify({productId}),
				})
				refetch();
				onClose();
    }
  }

	const handleQuantity = async (productId: string | undefined) => {
    if (productId){
				await fetch (`/api/list/setQuantity`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: 'include',
					body: JSON.stringify({productId, quantity, customerId: user}),
				})
				refetch();
				onClose();
    }
  }
	const debounceQuantity = useDebounce(quantity, 10000)
 	// useEffect(() => {
  //   handleQuantity(userList.product.productId?.toString());
  // }, [debounceQuantity]);
	return(
		<GridItem row={2}>
		<HStack 
			borderWidth="1px" 
			borderColor="black" 
			bgGradient="linear(to-r, #374D76, #D7A462)" 
			spacing={2} 
			borderRadius="3xl" 
			width="400"
		>

			<HStack borderRight="1px" height={{base: 100, sm: 90, md: 100, lg: 180}} width={{base: 234, lg: 312, xl: 440}}>
				<Box width={{base: 234, lg: 312, xl: 440}} color="white">
					<Center>
						<Image boxSize={{base: 70, md: 90, lg: 120}} src={userList.productData.image?.toString()} />
					</Center>
				</Box>

				<VStack width={{base: 234, lg: 312, xl: 440}}>
					<Text color="white" fontSize={{base: 15, lg: 30}}>
						{userList.productData.productName}
					</Text>

					<Text color="white" fontSize={{base: 10, md: 13, lg: 16}}>
						Price: Php {userList.productData.unitPrice} / Kg
					</Text>
				</VStack>
			</HStack>

			{!onStore && <VStack 
				width={{base: 50, sm: 63, md: 84, lg: 112, xl: 160}} 
			>
				<HStack 
					border={"1px"} 
					borderRadius={{base: '2xl', lg: '3xl'}} 
					width={{ md: 84, lg: 112, xl: 160}} 
					spacing={0}
				>

					<Center>
						<Box 
						as="button" 
						width={{base: 12, sm: 21, md: 28, lg: 37, xl: 53}} 
						onClick={() => decrementQuantity()} 
						boxSize={{base: 3, sm: 4, md: 5, lg: 7}} 
						borderRight={{base: '0', md: '1px'}}
						>
							<Center>
								<Icon as={MdRemove} boxSize={{base: 2, md: 3, lg: 6}}/>
							</Center>
						</Box>
					</Center>

					<Center>
						<Box 
							width={{base: 5, sm: 8, lg: 37, xl: 53}}
						>
							<Center>
								<Text 
								fontSize={{base: 'xs', sm: 'sm', lg: 'lg'}}
								>
									{quantity}
								</Text>
							</Center>
						</Box>
					</Center>

					<Center>
						<Box 
						as="button" 
						width={{base: 12, sm: 21, md: 28, lg: 37, xl: 53}} 
						onClick={() => increamentQuantity()} 
						boxSize={{base: 3, sm: 4, md: 5, lg: 7}} 
						borderLeft={{base: '0', md: '1px'}}
						>
							<Center>
								<Icon as={MdAddBox} boxSize={{base: 2, md: 3, lg: 6}}/>
							</Center>
						</Box>
					</Center>
				</HStack>
				
				<Center>
					<Box 
						as="button" 
						boxSize={{base: 4, md: 10}} 
					>
					<Icon 
						boxSize={{base: 4, md: 5, lg: 6}} 
						as={MdDelete}
						onClick={onOpen}
					/>
					</Box>
				</Center>	
			</VStack>}

			{onStore && 
			<VStack>
				<Button	
					width={{base: 35, sm: 63, md: 84, lg: 112, xl: 160}} bgGradient="linear(to-r, #D7A462, #374D76)" 
					onClick={onToCartOpen}
				>
					Add to Cart
				</Button >
				<Text>
					Current Quantity Added: {userList.product.quantity}
				</Text>
			</VStack>}	

			<Box></Box>
		</HStack>
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="">
			<Flex>
				<Text>
					Are you sure you want to remove this item?
				</Text>
				<HStack>
					<Button onClick={()=> handleDelete(userList.product.productId?.toString())}>
						Yes
					</Button>
					<Button onClick={() => onClose()}>
						No
					</Button>
				</HStack>
			</Flex>
		</ModalComp>
		<ModalComp isModalOpen={isToCartOpen} onModalClose={onToCartClose} title="">
			<SetListQuantity 
				customerId={customerId} 
				onModalClose={onToCartClose} 
				product={userList.productData}
				defaultQuantity={userList.product.quantity}
				refetch={refetch}
			/>
		</ModalComp>
		</GridItem>
	)
}