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
import AddPoints from './AddPoints'

type DataType = {
	 order: UserCart[],
	 id: string,
	 customerId: string
}

export default function OrderQRScanner() { 
	const [totalPrice, setTotalPrice] = useState(0);
	const { onOpen, isOpen, onClose } = useDisclosure();
	const { onOpen: checkoutOpen, isOpen: isCheckoutOpen, onClose: checkoutClose } = useDisclosure();
	const { onOpen: addPointsOpen, isOpen: isAddPointsOpen, onClose: addPointsClose } = useDisclosure();
	const { onOpen: confirmModalOpen, isOpen: isConfirmModalOpen, onClose: confirmModalClose } = useDisclosure();
	const [data, setData ] = useState<DataType>();
	const [orderId, setOrderId] = useState('');
  const handleErrorWebCam = (error : any) => {
    console.log(error);
  }
  const handleScanWebCam = async (result: string | null) => {
    if (result != null){
				const response = await fetch (`/api/orders/order/${result}`, {
					method: "GET", 
				})
				const orderData = await response.json();
				setData(orderData);
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
						{data?.order && data?.order.map((items) => {
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

				<Button onClick={addPointsOpen}>
					Add Points
				</Button>

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
					handleCheckout(data?.order!),
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

		<ModalComp isModalOpen={isAddPointsOpen} onModalClose={addPointsClose} title="Add Points">
			<AddPoints customerId={data?.customerId} onModalClose={addPointsClose}/>
		</ModalComp>
		</>
  );
}
