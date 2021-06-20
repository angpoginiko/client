import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			query: { id },
		} = req;
		const _id = new ObjectId(id.toString());
		const profile = await db.collection("customers").findOne(
			{_id}
		);
		res.status(201).send(profile.onStore);
	} catch (error) {
		res.status(500);
		res.json({error: "Server error"})
	}
});
