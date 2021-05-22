import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	try {
		const {
			data: {
				points,
				customerId
			}
		} = req.body;
		const id = new ObjectId(customerId);
		const newPoints = parseInt(points.points);
		console.log(req.body);
		const point = await db.collection("earnedPoints").insertOne({
			points: newPoints,
			dateAdded: new Date(),
			expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			customerId
		});
		const earnedId = point.ops[0]._id;
		const customer = await db.collection("customers").updateOne(
			{ "_id" : id },
			{ "$push": { "point.earned" : earnedId } }
	 )
		res.status(200).send(customer);
	} catch(err) {
		res.status(401).send({message: `${err.name} is the error` });
	}
	
});