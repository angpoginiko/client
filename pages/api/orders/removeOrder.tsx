import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';
import { ObjectId } from 'mongodb'
import { UserCart } from '../../../interfaces';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const {data, id} = req.body;
	const _id = new ObjectId(id);
	try {
		const userCart: UserCart[] = data;
		userCart.map(async (cart) => {
			const productId = new ObjectId(cart.product.productId)
			const productQuantity = cart.product.quantity;
			const customerId = new ObjectId(cart.customerId);
			const newQuantity = await db.collection("products").aggregate([
				{ $match: { _id: productId } },
				{ $project: { quantity: { $subtract: [ "$quantity", productQuantity ] } } } 
			]).toArray();
				newQuantity.map(async (quantity) => {
					await db.collection("products").findOneAndUpdate(
						{ _id: productId},
						{ $set:
								{
									quantity: quantity.quantity,
								}
						}
					);
				});
			await db.collection("cart").findOneAndUpdate(
				{"customerId": customerId},
				{ "$pull": { "product": { "productId" : productId } } }
				)
			});
		const products = await db.collection("orders").deleteOne({_id});
		if(!products){
			return res.status(400).json({success: false})
		}
		res.status(201).json({message: "Deleted"});
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})
