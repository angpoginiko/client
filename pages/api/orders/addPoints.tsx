import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { id, point } = req.body;
	try {
		const customerId = new ObjectId(id);
		const pointsRedeemed = parseFloat(point);
		const test = await db.collection("orders").findOneAndUpdate(
			{ customerId },
			{ $set:
					{
						"encashedPoints": pointsRedeemed
					}
			}
		);
		res.status(200).send(test);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})
