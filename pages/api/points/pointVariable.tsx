import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const _id = new ObjectId("60c714323d585efdee11dedf");
		const points = await db.collection("pointVariable").findOne(
			{_id}
		);
		res.status(201).send(points.pointVariable);
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
