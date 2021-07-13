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

interface GroceryMobileProductProps{
	userList: UserList;
	user: string;
	refetch: () => void;
	onStore: boolean;
	customerId: string;
}

export default function GroceryMobileProduct ({ userList, user, refetch, onStore, customerId } : GroceryMobileProductProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isToCartOpen, onOpen: onToCartOpen, onClose: onToCartClose } = useDisclosure();
	const { isOpen: isQuantityOpen, onOpen: onQuantityOpen, onClose: onQuantityClose } = useDisclosure();
	const [isSmall] = useMediaQuery("(min-width: 48em)")

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
		<GridItem row={1}>
					<VStack 
						bgGradient="linear(to-r, #374D76, #D7A462)"
						boxShadow={'2xl'}
						rounded={'lg'}
						pos={'relative'}
						role={'group'}
						p={6}
					>
						<Text fontSize="xs" color="white">
							Currently Added: {userList.product.quantity}
						</Text>
						<Box color="white">
							<Center>
								<Image boxSize="70" src={userList.productData.image?.toString()} />
							</Center>
						</Box>

						<VStack>
							<Text color="white" fontSize="15">
								{userList.productData.productName}, Price: Php {userList.productData.unitPrice}
							</Text>

							<Text color="white" fontSize="10">
								
							</Text>
						</VStack>
						{!onStore && 
						<VStack>

						<Center>
							<Center>
								<Icon onClick={onQuantityOpen} as={MdAddBox} boxSize="5" color="white"/>
								<Text onClick={onQuantityOpen} color="white" fontSize="12">Add Product</Text>
							</Center>
						</Center>
						
						<Center>
							<Icon 
								boxSize="5"
								as={MdDelete}
								onClick={onOpen}
								color="white"
							/>
							<Text onClick={onOpen} color="white" fontSize="12">Delete Product</Text>
						</Center>	
					</VStack>}

					{onStore && 
					<VStack>
						<Button	
							width="35" bgGradient="linear(to-r, #D7A462, #374D76)" 
							onClick={onToCartOpen}
						>
							{isSmall ? "Add to Cart" : <Icon as={MdShoppingCart} />}
						</Button >
						<Text fontSize="xs">
							Current Quantity Added: {userList.product.quantity}
						</Text>
					</VStack>}
				</VStack>
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