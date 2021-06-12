import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'
import jwt from 'jsonwebtoken';
import { Token } from '../../../../interfaces';

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
				const user = await db.collection("customers").findOne({_id: id});
				const { password, ...data } = user.profile
				res.status(200).send(data);
			} catch(err) {
				res.status(401).send({message: "youre not logged"});
			}
			break;

		case 'PUT':
			try {
				const {
					profile: {
						name,
						username,
						email,
						gender,
						mobilenumber,
						tin,
						address,
					}
				} = req.body;

				const profile = await db.collection("customers").findOneAndUpdate(
					{_id},
					{$set: { 
							"profile.name": name,
							"profile.username": username,
							"profile.email": email,
							"profile.gender": gender,
							"profile.mobilenumber": mobilenumber,
							"profile.tin" : tin,
							"profile.address" : address
					 }});
				if(!profile){
					return res.status(400).json({success: false})
				}
				console.log(gender);
				res.status(201).send(profile);
			} catch (error) {
				res.status(500);
				res.json({error: "Server error"})
			}
			break;
		default:
	}
}
