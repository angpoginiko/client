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
		const decoded = jwt.verify(cookies!, jwtSecretKey!) as Token;

		if(!decoded){
			return res.status(401).send({
				message: "youre not logged in"
			});
		}
		const id = new ObjectId(decoded.id);
		const point = await db.collection("customers").aggregate([
			{"$match" : {"_id" : id}},
			{"$lookup" : {
				"from" : "earnedPoints",
				"localField" : "point.earned",
				"foreignField" : "_id",
				"as" : "point.earned"
			}}
		]).toArray();
		point.map((points) => {
			res.status(200).send(points.point);
		});
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})


export const config = {
  api: {
    externalResolver: true,
  },
}