import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'


export default async function( _: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const challengeQuestion = await db.collection("challengeQuestions").find().toArray();
		res.status(201).send(challengeQuestion);
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