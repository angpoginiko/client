import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'

export default async function (req: NextApiRequest, res: NextApiResponse) 
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
				const productType = await db.collection("productType").findOne({_id});

				if(!productType){
					return res.status(400).json({success: false})
				}
				res.status(201).send(productType);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		case 'DELETE':
			try {
				const productType = await db.collection("productType").deleteOne({_id});

				if(!productType){
					return res.status(400).json({success: false})
				}
				res.status(201).send(productType);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;

		case 'PUT':
			try {
				const productType = await db.collection("productType").findOneAndUpdate({_id}, req.body);
				if(!productType){
					return res.status(400).json({success: false})
				}
				res.status(201).send(productType);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		default:
	}
}

export const config = {
  api: {
    externalResolver: true,
  },
}