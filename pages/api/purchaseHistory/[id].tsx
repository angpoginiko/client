import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method
	} = req;
	const { db } = await connect();
	const _id = new ObjectId(id.toString());
	switch(method){
		case 'GET' :
			try {
				const purchases = await db.collection("purchaseHistory").findOne({customerId :_id})
				if(!purchases){
					return res.status(400).json({success: false})
				}
				res.status(201).send({purchases});	
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			} 
			break;
		default:

	}
	
});

export const config = {
  api: {
    externalResolver: true,
  },
}