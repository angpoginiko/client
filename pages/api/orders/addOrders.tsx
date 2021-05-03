import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { id, items } = req.body;
	try {
		const customerId = new ObjectId(id);
		const orders = await db.collection("orders").insertOne({
			product : items,
			customerId
		});

		res.status(200).send(orders.ops[0]._id);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})
