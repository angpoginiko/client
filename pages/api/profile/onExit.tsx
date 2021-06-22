import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { id } = req.body;
	try {
		const _id = new ObjectId(id);
		await db.collection("customers").findOneAndUpdate(
			{ _id },
			{ $set:
					{
						onStore: false
					}
			}
		);
		res.status(200).send("DONE");
	} catch(err) {
		res.status(401).send(err);
	}
	
})
