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
				const cart = await db.collection("cart").aggregate([
					{"$match" : {customerId}},
					{"$unwind" : "$product"},
					{"$lookup" : {
						"from" : "display",
						"localField" : "product.productId",
						"foreignField" : "_id",
						"as" : "productData"
					}},
					{"$unwind" : "$productData"},
					{"$lookup" : {
						"from" : "unitOfMeasure",
						"localField" : "productData.unitOfMeasure",
						"foreignField" : "_id",
						"as" : "productData.unitOfMeasure"
					}},
					{"$unwind" : "$productData.unitOfMeasure"},
					{"$lookup" : {
						"from" : "productType",
						"localField" : "productData.productType",
						"foreignField" : "_id",
						"as" : "productData.productType"
					}},
					{"$unwind" : "$productData.productType"},
				]).toArray();
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
				const customerId = new ObjectId(id.toString());
				const productIdFormatted = new ObjectId(productId.toString());
				const cart = await db.collection("cart").findOneAndUpdate(
					{customerId},
					{ "$pull": { "product": { "productId": productIdFormatted } } }
					)

				if(!cart){
					return res.status(400).json({success: false})
				}
				res.status(201).send(cart);
			} catch (error) {
				res.status(500);
				res.json(error)
			}
			break;

		case 'PUT':
			try {
				const productIdFormatted = new ObjectId(productId.toString());
				const id = new ObjectId(customerId.toString())
				let cart;
				const exist = await db.collection("cart").findOne({customerId: id, "product.productId": productIdFormatted});
				if(exist) {
					cart = await db.collection("cart").findOneAndUpdate({customerId: id, "product.productId": productIdFormatted},
						{
							$set:
								{
									"product.$.quantity": parseFloat(quantity).toFixed(2)
								}
						}
					)
				} else {
					cart = await db.collection("cart").findOneAndUpdate(
						{ "customerId" : id },
						{ "$push" : { "product" :  {"productId": productIdFormatted, "quantity": parseInt(quantity)} } }
				)
				}
	
				if(!cart){
					return res.status(400).json({success: false})
				}
				res.status(201).send(cart);
			} catch (error) {
				console.log(error)
				res.status(500);
				res.json(error)
			}
			break;
		default:

	}
	
});

export const config = {
  api: {
    externalResolver: true,
  },
}
