import { useDisclosure,
	Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
	Text,
	Button,
 } from '@chakra-ui/react';
import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { UserCart } from '../interfaces';
import ModalComp from './ModalComp';
import ReceiptItem from './ReceiptItem';


export default function OrderQRScanner() { 
	const [totalPrice, setTotalPrice] = useState(0);
	const { onOpen, isOpen, onClose } = useDisclosure();
	const { onOpen: checkoutOpen, isOpen: isCheckoutOpen, onClose: checkoutClose } = useDisclosure();
	const { onOpen: confirmModalOpen, isOpen: isConfirmModalOpen, onClose: confirmModalClose } = useDisclosure();
	const [data, setData ] = useState<UserCart[]>();
	const [orderId, setOrderId] = useState('');
  const handleErrorWebCam = (error : any) => {
    console.log(error);
  }
  const handleScanWebCam = async (result: string | null) => {
		console.log(result)
    if (result){
				const response = await fetch (`/api/orders/order/${result}`, {
					method: "GET",
				})
				const orderData = await response.json();
				setData(orderData.order);
				setOrderId(result);
				onOpen();
				checkoutClose();
    }
  }
	const handleCheckout = async(data: UserCart[]) => {
		if (data){
			const response = await fetch (`/api/orders/removeOrder`, {
				method: "POST",	
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({data, id: orderId})
			})
			await response.json();
	}
	}
  return (
    <>
		<QrReader
			delay={300}
			style={{width: '100%'}}
			onError={handleErrorWebCam}
			onScan={handleScanWebCam}
		/>
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="Add to Cart">
			<>
				<Table>
					<Thead>
						<Tr>
							<Th>Quantity:</Th>
							<Th>Description</Th>
							<Th isNumeric>Price</Th>
						</Tr>
					</Thead>
					<Tbody>
						{data && data.map((items) => {
							return(
									<ReceiptItem item={items} setTotalPrice={setTotalPrice} key={items.product.productId?.toString()}/>
							)
						})}
					</Tbody>
					<Tfoot>
						<Tr>
							<Th/>
							<Th/>
							<Th isNumeric>Total: P{totalPrice}</Th>
						</Tr>
					</Tfoot>
				</Table>
				<Button onClick={() => {
					onClose(),
					checkoutOpen()
				}}>
					Checkout
				</Button>
			</>
		</ModalComp>
		<ModalComp isModalOpen={isCheckoutOpen} onModalClose={checkoutClose} title="">
			<>
				<Text>
					Confirm Checkout?
				</Text>
				<Button onClick={() => {
					handleCheckout(data!),
					checkoutClose()
					confirmModalOpen();
					}}>
					Yes
				</Button>
				<Button onClick={() => checkoutClose()}>
					No
				</Button>
			</>
		</ModalComp>
		<ModalComp isModalOpen={isConfirmModalOpen} onModalClose={confirmModalClose} title="">
			<>
				<Text>
					Checkout Confirmed
				</Text>
			</>
		</ModalComp>
		</>
  );
}
