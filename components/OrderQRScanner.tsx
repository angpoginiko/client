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
	Center,
 } from '@chakra-ui/react';
import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { UserCart } from '../interfaces';
import ModalComp from './ModalComp';
import ReceiptItem from './ReceiptItem';
import { useQuery } from 'react-query';


type DataType = {
 _id: string;
 order: UserCart[];
}

export default function OrderQRScanner() { 
	const { onOpen, isOpen, onClose } = useDisclosure();
	const { onOpen: checkoutOpen, isOpen: isCheckoutOpen, onClose: checkoutClose } = useDisclosure();
	const { onOpen: confirmModalOpen, isOpen: isConfirmModalOpen, onClose: confirmModalClose } = useDisclosure();
	const [data, setData ] = useState<DataType>();
	const [orderId, setOrderId] = useState('');
	const totalPrice = data?.order[0]?.total;
  const handleErrorWebCam = (error : any) => {
    console.log(error);
  }
	let encashedPoints = 0; 
	data?.order.map((orders) => {
		encashedPoints = orders.encashedPoints ? orders.encashedPoints : 0;
	});

	const fetchPointVariable = async () => {
		const res = await fetch(`api/points/pointVariable`);
		return res.json();
	}
	const { data: pointVariable } = useQuery<number>("pointVariable", fetchPointVariable);

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
	const handleCheckout = async(order: UserCart[]) => {
		const points = encashedPoints || 0;
		let addedPoints = (totalPrice!/pointVariable!);
		order.map((orders) => {
			if(orders.product.hasContainer){
				addedPoints+=(10/pointVariable!);
			}
		});
		const body = {
			points: addedPoints,
			customerId: data?.order[0].customerId
		}
		if (order){
			const response = await fetch (`/api/orders/removeOrder`, {
				method: "POST",	
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({data: order, id: orderId, encashedPoints: points, totalPrice: totalPrice})
			})
			await response.json();
		}
		const response = await fetch("/api/points/addPoints", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({data: body}),
		});
		await response.json();
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
			<Center>
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
						{Boolean(encashedPoints) && 
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
			</Center>
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
		</>
  );
}
