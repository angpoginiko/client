import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { id } = req.body;
	try {
		const customerId = new ObjectId(id);
		const onStore = await db.collection("customers").findOneAndUpdate(
			{ customerId },
			{ $set:
					{
						onStore: false
					}
			}
		);
		res.status(200).send(onStore.value._id);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})
