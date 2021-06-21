import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const productTypes = await db.collection("productType").find().toArray();
		res.status(201).send(productTypes);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error${req}`})
	}
});
