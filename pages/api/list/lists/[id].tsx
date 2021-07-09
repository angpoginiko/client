import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method,
		body: { productId }
	} = req;


	const { db } = await connect();
	const customerId = new ObjectId(id.toString());
	switch(method){
		case 'GET' :
			try {
				const cart = await db.collection("list").aggregate([
					{"$match" : {customerId}},
					{"$unwind" : "$product"},
					{"$lookup" : {
						"from" : "display",
						"localField" : "product.productId",
						"foreignField" : "_id",
						"as" : "productData"
					}},
					{"$unwind" : "$productData"}
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
				const list = await db.collection("list").findOneAndUpdate(
					{customerId},
					{ "$pull": { "product": { "productId": productIdFormatted } } }
					)

				if(!list){
					return res.status(400).json({success: false})
				}
				res.status(201).send(list);
				} catch (error) {
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
