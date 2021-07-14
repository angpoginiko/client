import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method,
	} = req;


	const { db } = await connect();
	const customerId = new ObjectId(id.toString());
	switch(method){
		case 'GET' :
			try {
				const customer = await db.collection("customers").aggregate([
					{"$match" : {_id : customerId}},
					{"$lookup" : {
						"from" : "challengeQuestions",
						"localField" : "challengeQuestionAnswer.challengeQuestion",
						"foreignField" : "_id",
						"as" : "challengeQuestionAnswer.challengeQuestion"
					}},
					{"$unwind" : "$challengeQuestionAnswer.challengeQuestion"},
				]).toArray();
				const questionAndAnswer = customer[0].challengeQuestionAnswer;
				if(!customer){
					return res.status(400).json({success: false})
				}
				res.status(201).send(questionAndAnswer);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			} 
			break;

	}
	
};

export const config = {
  api: {
    externalResolver: true,
  },
}
