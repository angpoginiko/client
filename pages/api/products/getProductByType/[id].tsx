import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../../utils/mongodb'
import { authentication } from '../../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			query: { id },
		} = req;
		const productType = new ObjectId(id.toString());
		const products = await db.collection("display").aggregate(
			[{"$match" : {productType}},
			{"$lookup" : {
				"from" : "unitOfMeasure",
				"localField" : "unitOfMeasure",
				"foreignField" : "_id",
				"as" : "unitOfMeasure"
			}},
			{"$unwind" : "$unitOfMeasure"},
		]).toArray();
		res.status(201).send(products);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error${req}`})
	}
});

export const config = {
  api: {
    externalResolver: true,
  },
}
