import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'


export default async function (_: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const _id = new ObjectId("60e71fb7276015344d3be139");
		const socialMedia = await db.collection("socialMedia").findOne({_id});
		res.status(201).send(socialMedia);
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