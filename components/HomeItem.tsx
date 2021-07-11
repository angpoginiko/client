import {
  Box,
  Center,
  useColorModeValue,
  Text,
  Stack,
  Image,
	Button,
	useDisclosure,
	VStack,
	GridItem
} from '@chakra-ui/react';
import { ProductType } from '../interfaces';
import React from 'react';
import ModalComp from './ModalComp';
import HomeQuantity from './HomeQuantity';

interface HomeItemProps {
	product: ProductType | undefined
	closeProduct?: () => void
	customerId: string | undefined
}


export default function HomeItem({product, customerId} : HomeItemProps) {
	const { onOpen, isOpen, onClose } = useDisclosure();
  return (
		<GridItem w={{base: 120, md: 150}}>
			<Center>
				<Box
					role={'group'}
					p={6}
					maxW={'330px'}
					maxH={'330px'}
					bg={useColorModeValue('white', 'gray.800')}
					boxShadow={'2xl'}
					rounded={'lg'}
					pos={'relative'}
					h={{base: 210, sm: 250}}
				>
					
					<VStack>
						<Image
							rounded={'lg'}
							src={product?.image!.toString()}
							boxSize={{ base: "70%", 'sm': 100}}
						/>
						<Stack align={'center'}>
							<Text fontSize="sm">
								{product?.productName}, P{product?.unitPrice!}/ {product?.unitOfMeasure?.name}
							</Text>
							<Stack>
								<Button 
								onClick={onOpen}
								size="sm"
								>
									Add
								</Button>
							</Stack>
						</Stack>
					</VStack>
					<ModalComp title="" isModalOpen={isOpen} onModalClose={() => {onClose()}}>
						<HomeQuantity onModalClose={onClose} product={product!} customerId={customerId!}/>
					</ModalComp>
				</Box>
			</Center>
		</GridItem>
  );
}