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
	GridItem,
	useMediaQuery
} from '@chakra-ui/react';
import { MdAddBox, MdDelete } from "react-icons/md";
import ModalComp from "./ModalComp";
import SetListQuantity from "./SetListQuantity";
import { MdShoppingCart } from "react-icons/md";
import AddGroceryProductToCart from "./AddGroceryProductToCart";

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
	const { isOpen: isQuantityOpen, onOpen: onQuantityOpen, onClose: onQuantityClose } = useDisclosure();
	const [isSmall] = useMediaQuery("(min-width: 48em)");


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
						Price: Php {userList.productData.unitPrice} / {userList.productData.unitOfMeasure?.name}
					</Text>
				</VStack>
			</HStack>

			{!onStore && <VStack 
				width={{base: 50, sm: 63, md: 84, lg: 112, xl: 160}} 
			>
				<Center>
					<Text fontSize={{base: 8, md: 11, lg: 14}}>
						Currently Added: {userList.product.quantity} {userList.productData.unitOfMeasure?.name}
					</Text>
				</Center>
				<Center>
					<Box 
						as="button" 
						boxSize={{base: 3, md: 10}} 
					>
					<Icon 
						boxSize={{base: 3, md: 5, lg: 6}} 
						as={MdAddBox}
						onClick={onQuantityOpen}
						color="White"
					/>
					</Box>
					<Text onClick={onQuantityOpen} color="White" fontSize={{base: 10, md: 12, lg: 16}}>Add More</Text>
				</Center>	
				<Center>
					<Box 
						as="button" 
						boxSize={{base: 3, md: 10}} 
					>
					<Icon 
						boxSize={{base: 3, md: 5, lg: 6}} 
						as={MdDelete}
						onClick={onOpen}
						color="White"
					/>
					</Box>
					<Text onClick={onOpen} color="White" fontSize={{base: 10, md: 12, lg: 16}}>Delete Item</Text>
				</Center>	
			</VStack>}

			{onStore && 
			<VStack>
				<Button	
					width={{base: 35, sm: 63, md: 84, lg: 112, xl: 160}} bgGradient="linear(to-r, #D7A462, #374D76)" 
					onClick={onToCartOpen}
				>
					{isSmall ? "Add to Cart" : <Icon as={MdShoppingCart} />}
				</Button >
				<Text fontSize={{base: "xs", md: "md" }}>
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
		<ModalComp isModalOpen={isQuantityOpen} onModalClose={onQuantityClose} title="">
			<SetListQuantity 
				customerId={customerId} 
				onModalClose={onQuantityClose} 
				product={userList.productData}
				defaultQuantity={userList.product.quantity}
				refetch={refetch}
			/>
		</ModalComp>
		<ModalComp isModalOpen={isToCartOpen} onModalClose={onToCartClose} title="">
			<AddGroceryProductToCart 
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