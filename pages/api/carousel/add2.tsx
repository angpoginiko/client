import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { image } = req.body;
	try {
		const _id = new ObjectId("60e58d8254c395b39880463f");
		const test = await db.collection("carousel").findOneAndUpdate(
			{ _id },
			{ $set:
					{
						"image2": image
					}
			}
		);
		res.status(200).send(test);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})

export const config = {
  api: {
    externalResolver: true,
  },
}
