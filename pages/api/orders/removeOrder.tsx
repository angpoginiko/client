import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';
import { ObjectId } from 'mongodb'

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const {data, id, totalPrice, encashedPoints} = req.body;
	const _id = new ObjectId(id);
	try {
		const userCart = data;
		const customerId = new ObjectId(userCart[0].customerId);
		userCart.map(async (cart: any) => {
				const productId = new ObjectId(cart.product.productId)
				const productQuantity = cart.product.quantity;
				const display =  await db.collection("display").findOne({_id: productId});
				const newQuantity = parseFloat(display.quantity) - productQuantity
				await db.collection("display").findOneAndUpdate(
					{ _id: productId},
					{ $set:
							{
								quantity: newQuantity.toFixed(2),
							}
					}
				);
				await db.collection("cart").findOneAndUpdate(
					{"customerId": customerId},
					{ "$pull": { "product": { "productId" : productId } } }
					)	
				if(parseInt(encashedPoints) != 0) {
					await db.collection("customers").updateOne(
						{ "_id" : customerId },
						{ "$push" : { "point.encashed" :  { "points" : parseFloat(encashedPoints), "dateCheckout": new Date()} } }
					)
				}
		});
		
		await db.collection("purchaseHistory").findOneAndUpdate(
			{ "customerId" : customerId },
			{ "$push" : { "purchases" :  {"cart": data, dateCheckout: new Date(), totalPrice, encashedPoints} } }
		);
		const products = await db.collection("orders").findOneAndUpdate(
			{ _id },
			{ $set:
					{
						product: [],
						total: 0
					}
			}
		);
		if(!products){
			return res.status(400).json({success: false})
		}
		res.status(201).json({message: "Deleted"});
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})
