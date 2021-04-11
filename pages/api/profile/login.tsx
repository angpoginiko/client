import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie';


export default async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	const {
		profile: {
			username,
			password,
		}
	} = req.body;
	
	try {
		const existingUser = await db.collection("customers").findOne({"profile.username": username});
		if(!existingUser) return res.status(404).json({message: "User doesnt exist"});
		
		const isPasswordCorrect = await bcrypt.compare(password,existingUser.profile.password);
		if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Password"});
		const token = jwt.sign({email: existingUser.email, id: existingUser._id}, jwtSecretKey!, {expiresIn: "1h"});

		res.setHeader('Set-Cookie', cookie.serialize('auth', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'strict',
			maxAge: 3600,
			path: '/'
		}));

		res.status(200).json({message: "Login Done"});

		

	} catch (error) {
		res.status(500).json({message: "Something went wrong"});
	}
	
}
