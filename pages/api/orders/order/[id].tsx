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
				const scanned = await db.collection("orders").findOne({_id});
				if(scanned.isScanned == false){
					await db.collection("orders").findOneAndUpdate(
						{_id},
						{ $set: { "isScanned": true } });
					const order = await db.collection("orders").aggregate([
						{"$unwind" : "$product"},
						{"$lookup" : {
							"from": 'products',
							"localField": 'product.productId',
							"foreignField": '_id',
							"as": 'productData'
						}}
					]).toArray();
					if(!order){
						return res.status(400).json({success: false})
					}
					res.status(201).send({order,id});	
				}
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			} 
			break;
		default:

	}
	
})
