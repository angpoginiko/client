import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken'

export const authentication = (fn:NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) =>{
	const jwtSecretKey = process.env.JWT_SECRET_KEY;
	verify(req.cookies.auth!, jwtSecretKey!, async function(err, decoded) {
		if(!err && decoded){
			return await fn(req, res);
		}
	res.status(401).json({message: "You need to login first"});
});
}
