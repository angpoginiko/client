import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const products = await db.collection("display").aggregate([
			{"$lookup" : {
				"from" : "products",
				"localField" : "product",
				"foreignField" : "_id",
				"as" : "product"
			}},
			{"$unwind" : "$product"},
			{"$lookup" : {
				"from" : "unitOfMeasure",
				"localField" : "product.unitOfMeasure",
				"foreignField" : "_id",
				"as" : "product.unitOfMeasure"
			}},
			{"$unwind" : "$product.unitOfMeasure"},
			{"$lookup" : {
				"from" : "productType",
				"localField" : "product.productType",
				"foreignField" : "_id",
				"as" : "product.productType"
			}},
			{"$unwind" : "$product.productType"},
		]).toArray();
		res.status(201).send(products);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error${req}`})
	}
})

export const config = {
  api: {
    externalResolver: true,
  },
}