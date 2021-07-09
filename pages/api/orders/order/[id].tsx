import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method
	} = req;
	const { db } = await connect();
	const _id = new ObjectId(id.toString());
	switch(method){
		case 'DELETE':
			try {
				const products = await db.collection("orders").deleteOne({_id});

				if(!products){
					return res.status(400).json({success: false})
				}
				res.status(201).json({message: "Deleted"});
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		case 'GET' :
			try {
				const order = await db.collection("orders").aggregate([
					{"$match" : {_id}},
					{"$unwind" : "$product"},
					{"$lookup" : {
						"from": 'display',
						"localField": 'product.productId',
						"foreignField": '_id',
					"as": 'productData'
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
				]).toArray()
				if(!order){
					return res.status(400).json({success: false})
				}
				res.status(201).send({order, id});	
				res.status(200).send(order);
			} catch (error) {
				res.status(500);
				res.json({error: error})
			} 
			break;
		default:

	}
	
})

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// }
