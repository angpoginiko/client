import {
  Box,
  Text,
	Image,
	HStack,
	VStack,
	Icon,
	Center
} from '@chakra-ui/react';
import { MdAddBox, MdRemove, MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { ProductType, UserCart } from '../interfaces';

interface CartProductProps{
	userCart: UserCart
	modalOpen: () => void;
}

export default function CartProduct ({ userCart, modalOpen } : CartProductProps) {
	let { productName, unitPrice, productDesc  } : ProductType = {}
	const [quantity, setQuantity] = useState(userCart.product.quantity);
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
	userCart.productData.map((data) => {
		productName = data.productName
		unitPrice = data.unitPrice
		productDesc = data.productDesc
	})
	return(
		<>
		<HStack borderWidth="1px" borderColor="black" bgGradient="linear(to-r, #374D76, #D7A462)" spacing="5px" borderRadius="3xl">
			<HStack borderRight="1px" boxSize="180px" width="300px">
				<Box w="120px" height="100" color="white">
					<Center>
						<Image boxSize="100px" src="https://www.the-pasta-project.com/wp-content/uploads/2017/08/Fettuccine-640x433.jpg" />
					</Center>
				</Box>

				<VStack>
					<Text color="white">
						{productName}
					</Text>

					<Text color="white">
						Price: Php {unitPrice} / Kg
					</Text>
				</VStack>
			</HStack>
			
			<HStack boxSize="180px" borderRight="1px" width="500px">

				<Text color="white">
					<Text>
						Description:
					</Text>	
					<Text> 
						{productDesc}
					</Text>

				</Text>

			</HStack>
			
			<VStack width="100px">

				<HStack border={"1px"} borderRadius="3xl">
					<Center>
						<Box as="button" onClick={() => decrementQuantity()} boxSize={7} borderRight="1px"><Icon as={MdRemove}/></Box>
							<Box width={7}><Center>{quantity}</Center></Box>
						<Box as="button" onClick={() => increamentQuantity()} boxSize={7} borderLeft="1px"><Icon as={MdAddBox}/></Box>
					</Center>	
				</HStack>

				<Center>
					<Box as="button" onClick={() => modalOpen()} boxSize={10}><Icon boxSize={6} as={MdDelete}/></Box>
				</Center>	
			</VStack>
		</HStack>
		</>
	);
}