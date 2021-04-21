import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method
	} = req;
	const {
		productId,
		quantity
	} = req.body


	const { db } = await connect();
	const customerId = new ObjectId(id.toString());
	switch(method){
		case 'GET' :
			try {
				const cart = await db.collection("cart").find({"customerId" : customerId}).toArray();
				if(!cart){
					return res.status(400).json({success: false})
				}
				res.status(201).send(cart);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			} 
			break;
		case 'DELETE':
			try {
				const cart = await db.collection("cart").deleteOne({customerId});

				if(!cart){
					return res.status(400).json({success: false})
				}
				res.status(201).send(cart);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;

		case 'PUT':
			try {
			let cart;
			 const exist = await db.collection("cart").findOne({"product.productId" : productId });
			 if(!exist) {
					cart = await db.collection("cart").findOneAndUpdate(
						{ "customerId" : customerId },
						{ "$push": { "product" :  {"productId": productId, "quantity": quantity} } }
				);
			 } else {
					const query = { customerId };
					const updateDocument = {
						$set: { "product.$[orderItem].quantity": quantity }
					};
					const options = {
						arrayFilters: [{
							"orderItem.productId" : productId,
						}]
					};
					cart = await db.collection("cart").findOneAndUpdate(query, updateDocument,options);
					
			 }
				if(!cart){
					return res.status(400).json({success: false})
				}
				res.status(201).send(cart);
			} catch (error) {
				console.log(error)
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		default:

	}
	
});
