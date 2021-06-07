import { useDisclosure,
	Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
	Text,
	Button,
	Td,
 } from '@chakra-ui/react';
import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { UserCart } from '../interfaces';
import ModalComp from './ModalComp';
import ReceiptItem from './ReceiptItem';
import AddPoints from './AddPoints'
import Encashment from './Encashment';

type DataType = {
	 order: UserCart[],
	 id: string,
	 customerId: string
}

export default function OrderQRScanner() { 
	const [encashedPoints, setEncashedPoints] = useState<number|undefined>(undefined);
	const { onOpen, isOpen, onClose } = useDisclosure();
	const { onOpen: checkoutOpen, isOpen: isCheckoutOpen, onClose: checkoutClose } = useDisclosure();
	const { onOpen: addPointsOpen, isOpen: isAddPointsOpen, onClose: addPointsClose } = useDisclosure();
	const { onOpen: encashedPointsOpen, isOpen: isEncashedPointsOpen, onClose: encashedPointsClose } = useDisclosure();
	const { onOpen: confirmModalOpen, isOpen: isConfirmModalOpen, onClose: confirmModalClose } = useDisclosure();
	const [data, setData ] = useState<DataType>();
	const [orderId, setOrderId] = useState('');
	const totalPrice = data?.order[0]?.total;
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
		const points = encashedPoints || 0;
		if (data){
			const response = await fetch (`/api/orders/removeOrder`, {
				method: "POST",	
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({data, id: orderId, encashedPoints: points, totalPrice: totalPrice})
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
		<ModalComp isModalOpen={isOpen} onModalClose={onClose} title="To Checkout">
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
									<ReceiptItem item={items} key={items.product.productId?.toString()}/>
							)
						})}
					</Tbody>
					<Tfoot>
						{encashedPoints && 
							<Tr>
								<Th/>
								<Td>Encashed Points: </Td>
								<Td isNumeric> -{encashedPoints}</Td>
							</Tr>
						}
						<Tr>
							<Th/>
							<Th/>
							<Th isNumeric>Total: P{encashedPoints ? totalPrice!-encashedPoints : totalPrice}</Th>
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

				<Button onClick={encashedPointsOpen}>
					Encash Points
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

		<ModalComp isModalOpen={isEncashedPointsOpen} onModalClose={encashedPointsClose} title="Add Points">
			<Encashment customerId={data?.customerId} onModalClose={encashedPointsClose} setPoints={setEncashedPoints}/>
		</ModalComp>
		</>
  );
}
