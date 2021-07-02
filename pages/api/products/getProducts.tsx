import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
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
		res.status(201).send(products);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error${req}`})
	}
})
