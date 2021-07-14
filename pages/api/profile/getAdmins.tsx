import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'


export default async function( _: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const cashier = await db.collection("customers").aggregate([
			{"$match" : {"profile.userRole" : 2}},
			{ "$group": {
				_id: "$_id",
				name: {
					"$push": "$profile.name"
				},
			}},
		{"$unwind" : "$name"}
		]).toArray();
		res.status(201).send(cashier);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error`})
	}
};

export const config = {
  api: {
    externalResolver: true,
  },
}