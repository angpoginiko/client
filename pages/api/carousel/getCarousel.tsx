import { ObjectId } from 'mongodb';
import { NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'


export default async function ( _, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const _id = new ObjectId("60e58d8254c395b39880463f");

		const carousel =  await db.collection("carousel").findOne({_id});
			
			res.status(200).send(carousel);
		}
	 catch (error) {
		res.status(401);
		res.json({message: `${error}`})
	}
	
}

export const config = {
  api: {
    externalResolver: true,
  },
}