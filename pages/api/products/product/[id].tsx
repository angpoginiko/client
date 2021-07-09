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
				const products = await db.collection("display").aggregate([
					{"$match" : {"_id" : _id}},
					{"$lookup" : {
						"from" : "productType",
						"localField" : "productType",
						"foreignField" : "_id",
						"as" : "productType"
					}},
					{"$lookup" : {
						"from" : "unitOfMeasure",
						"localField" : "unitOfMeasure",
						"foreignField" : "_id",
						"as" : "unitOfMeasure"
					}},
					{"$unwind" : "$unitOfMeasure"},
				]).toArray();
				if(!products){
					return res.status(400).json({success: false})
				}
				res.status(201).send(products[0]);
			} catch (error) {
				res.status(500);
				res.json({error})
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
						productType,
						unitOfMeasure,
						unitPrice,
						reorderingStorageStock,
						reorderingDisplayStock,
						productDesc,
					},
					image,
				} = req.body;
				const productTypeId = new ObjectId(productType);
				const unitOfMeasureId = new ObjectId(unitOfMeasure);
				const products = await db.collection("products").findOneAndUpdate({_id}, 
					{ $set:
						{
							productName,
							unitPrice: parseInt(unitPrice),
							productType: productTypeId,
							unitOfMeasure: unitOfMeasureId,
							reorderingDisplayStock: parseInt(reorderingDisplayStock),
							reorderingStorageStock: parseInt(reorderingStorageStock),
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

export const config = {
  api: {
    externalResolver: true,
  },
}
