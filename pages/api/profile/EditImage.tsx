import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';
import { ObjectId } from 'mongodb';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			image,
			id
		} = req.body;
		const _id = new ObjectId(id);
		const customer = await db.collection("customers").findOneAndUpdate(
			{_id},
			{$set: { 
					"profile.image": image
			 }});
		res.status(201).send(customer);
		
	} catch (error) {
		res.status(500);
		res.json({error: "Server error"})
	}
	
})

export const config = {
  api: {
    externalResolver: true,
  },
}
