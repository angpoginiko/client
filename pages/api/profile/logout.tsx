import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';


export default async function (req: NextApiRequest, res: NextApiResponse) 
{	
	try {
		res.setHeader('Set-Cookie', cookie.serialize('auth', '', {
			maxAge: 0,
			path: '/'
		}));

		res.status(200).json({message: "Logged Out"});

	} catch (error) {
		res.status(500).json({message: "Something went wrong"});
	}
	
}
