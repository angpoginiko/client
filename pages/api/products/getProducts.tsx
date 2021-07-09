import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (_: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const products = await db.collection("products").aggregate([
			{"$lookup" : {
				"from" : "productType",
				"localField" : "productType",
				"foreignField" : "_id",
				"as" : "productType"
			}},
			{"$unwind" : "$productType"},
			{"$lookup" : {
				"from" : "unitOfMeasure",
				"localField" : "unitOfMeasure",
				"foreignField" : "_id",
				"as" : "unitOfMeasure"
			}},
			{"$unwind" : "$unitOfMeasure"}
		]).toArray();
		res.status(200).send(products);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error`})
	}
})


export const config = {
  api: {
    externalResolver: true,
  },
}