import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import bcrypt from 'bcryptjs'


export default async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			profile: {
				name,
				username,
				email,
				password,
				repeatpassword
			}
		} = req.body;
		const existingUser = await db.collection("profile").findOne({username});
		const existingEmail = await db.collection("profile").findOne({email});
		if(existingUser || existingEmail) return res.status(400).json({message: "User already exist"});
		if(password !== repeatpassword) return res.status(400).json({message: "Passwords does not match"});
		
		const hashedPassword = await bcrypt.hash(password, 12);

		const customer = await db.collection("customers").insertOne({
			profile: {
				username,
				password: hashedPassword,
				email,
				name,
				userRole: 0,
				image: ''
			},
			point: {
				earned: [],
				redeemed: [],
				encashed: [],
			}
		});
		const id = customer.ops[0]._id;

		await db.collection("cart").insertOne({
			product : [],
			customerId: id
		});

		await db.collection("purchaseHistory").insertOne({
			purchases : [],
			customerId: id
		});
		res.status(201).send(customer);
		
	} catch (error) {
		res.status(500);
		res.json({error: "Server error"})
	}
	
}
