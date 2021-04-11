import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import jwt from 'jsonwebtoken'
import { Token } from '../../../interfaces';
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	try {
		const cookies = req.cookies.auth;
		const { points } = req.body;
		const decoded = jwt.verify(cookies!, jwtSecretKey!) as Token;

		if(!decoded){
			return res.status(401).send({
				message: "youre not logged in"
			});
		}
		const id = new ObjectId(decoded.id);
		const point = await db.collection("earnedPoints").insertOne({
			points,
			dateAdded: new Date(),
			expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
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