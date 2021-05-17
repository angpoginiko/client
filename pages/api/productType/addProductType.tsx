import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			name
		} = req.body;
		const existingProduct = await db.collection("productType").findOne({name});
		if(existingProduct) return res.status(400).json({message: "Product Type already exist"});

		const types = await db.collection("productType").insertOne({
			name
		});
		res.status(200).send(types.ops[0]);
	} catch (error) {
		res.status(401);
		res.json({message: `${error}`})
	}
	
})
