import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import bcrypt from 'bcryptjs'
import { authentication } from '../authentication';
import { ObjectId } from 'mongodb';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			oldpassword,
			newpassword,
			id,
		} = req.body;
		const _id = new ObjectId(id);
		console.log(req.body)
		const user = await db.collection("customers").findOne({_id: _id});
		const isPasswordCorrect = await bcrypt.compare(oldpassword,user.profile.password);
		console.log(isPasswordCorrect)
		if(!isPasswordCorrect) return res.status(400).json({message: "Old Passwords does not match"});

		const isSameAsOldPassword = await bcrypt.compare(newpassword,user.profile.password);
		if(isSameAsOldPassword) return res.status(400).json({message: "New Passwords cannot be the same as the old one"});
		
		const hashedPassword = await bcrypt.hash(newpassword, 12);

		const customer = await db.collection("customers").findOneAndUpdate(
			{_id},
			{$set: { 
					"profile.password": hashedPassword
			 }});
		res.status(201).send(customer);
		
	} catch (error) {
		res.status(500);
		res.json({error: "Server error"})
	}
	
})
