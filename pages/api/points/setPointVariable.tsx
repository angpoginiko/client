import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { points } = req.body;
	try {
		const _id = new ObjectId("60c714323d585efdee11dedf");
		const pointsRedeemed = parseInt(points);
		const test = await db.collection("pointVariable").findOneAndUpdate(
			{ _id },
			{ $set:
					{
						"pointVariable": pointsRedeemed
					}
			}
		);
		res.status(200).send(test);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})
