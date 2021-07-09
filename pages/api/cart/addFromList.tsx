import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { CartProductType } from '../../../interfaces';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { customerId, productId, quantity } = req.body;
	try {
		const productIdFormatted = new ObjectId(productId.toString());
		const id = new ObjectId(customerId.toString())
		let cart;
		const exist = await db.collection("cart").findOne({customerId: id, "product.productId": productIdFormatted});
		const cartItem = await db.collection("cart").aggregate([
			{"$match" : {"product.productId": productIdFormatted}},
			{"$match" : {"customerId" : id}},
			{"$unwind" : "$product"}
		]).toArray();
		const listItem = await db.collection("list").aggregate([
			{"$match" : {"product.productId": productIdFormatted}},
			{"$match" : {"customerId" : id}},
			{"$unwind" : "$product"}
		]).toArray();
		const cartQuantity = cartItem[0].product.quantity;
		const listQuantity = listItem[0].product.quantity;
		if(exist) {
			const value = parseFloat(cartQuantity) + parseFloat(quantity);
			cart = await db.collection("cart").findOneAndUpdate({customerId: id, "product.productId": productIdFormatted},
				{
					$set:
						{
							"product.$.quantity": value.toFixed(2)
						}
				}
			)
		} else {
			cart = await db.collection("cart").findOneAndUpdate(
				{ "customerId" : id },
				{ "$push" : { "product" :  {"productId": productIdFormatted, "quantity": parseInt(quantity)} } })
		}

		if(parseInt(listQuantity) > parseInt(quantity)){
			const value = parseFloat(listQuantity) - parseFloat(quantity);
			await db.collection("list").findOneAndUpdate({customerId: id, "product.productId": productIdFormatted},
			{
				$set:
					{
						"product.$.quantity": value.toFixed(2)
					}
			}
		)
		} else {
			console.log("hello?")
			await db.collection("list").findOneAndUpdate(
				{"customerId": id},
				{ "$pull": { "product": { "productId": productIdFormatted } } }
				)
		}

		if(!cart){
			return res.status(400).json({success: false})
		}
		res.status(201)
		.send(cart);
	} catch (error) {
		console.log(error)
		res.status(500);
		res.json(error)
	}
	
})

export const config = {
  api: {
    externalResolver: true,
  },
}