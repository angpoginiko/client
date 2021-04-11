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
		const { productId, quantity } = req.body;
		const decoded = jwt.verify(cookies!, jwtSecretKey!) as Token;

		if(!decoded){
			return res.status(401).send({
				message: "youre not logged in"
			});
		}
		const id = new ObjectId(decoded.id);
		const cart = await db.collection("cart").insertOne({
			productId,
			quantity,
			customerId: id,
		});
		res.status(200).send(cart);
	} catch(err) {
		res.status(401).send({message: `${err.name} is the error` });
	}
	
});