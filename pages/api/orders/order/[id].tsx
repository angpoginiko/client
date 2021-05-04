import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method
	} = req;
	const { db } = await connect();
	const _id = new ObjectId(id.toString());
	switch(method){
		case 'DELETE':
			try {
				const products = await db.collection("orders").deleteOne({_id});

				if(!products){
					return res.status(400).json({success: false})
				}
				res.status(201).send(products);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		default:

	}
	
}
