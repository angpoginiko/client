import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../../authentication';

export default authentication (async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method
	} = req;
	const { db } = await connect();
	const _id = new ObjectId(id.toString());
	switch(method){
		case 'GET' :
			try {
				const products = await db.collection("products").aggregate([
					{"$match" : {"_id" : _id}},
					{"$lookup" : {
						"from" : "productType",
						"localField" : "productType",
						"foreignField" : "_id",
						"as" : "productType"
					}}
				]).toArray();

				if(!products){
					return res.status(400).json({success: false})
				}
				res.status(201).send(products[0]);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		case 'DELETE':
			try {
				const products = await db.collection("products").deleteOne({_id});

				if(!products){
					return res.status(400).json({success: false})
				}
				res.status(201).send(products);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;

		case 'PUT':
			try {
				const {
					product: {
						productName,
						unitPrice,
						productType,
						quantity,
						productDesc,
					},
					image,
				} = req.body;
				console.log(req.body)
				const productTypeId = new ObjectId(productType);
				const products = await db.collection("products").findOneAndUpdate({_id}, 
					{ $set:
						{
							productName,
							unitPrice: parseInt(unitPrice),
							productType: productTypeId,
							quantity: parseInt(quantity), 
							productDesc,
							image
						}
					});
				if(!products){
					return res.status(400).json({success: false})
				}
				res.status(201).send(products);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		default:

	}
	
})
