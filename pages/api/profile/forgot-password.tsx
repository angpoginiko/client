import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'

export default async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { username } = req.body;
	try {
		const customer = await db.collection("customers").findOne(
			{ "profile.username" : username }
		);
		const { password, ...profile } = customer.profile;
		const id = customer._id
		const user = { id, ...profile }
		res.status(200).send(user);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
}

export const config = {
  api: {
    externalResolver: true,
  },
}
