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
		const formattedName: string = name.toLowerCase();
		const existingProduct = await db.collection("unitOfMeasure").findOne({name: formattedName});
		if(existingProduct) return res.status(400).json({message: "Product Family already exist"});

		const types = await db.collection("unitOfMeasure").insertOne({
			name: formattedName
		});
		res.status(200).send(types.ops[0]);
	} catch (error) {
		res.status(401);
		res.json({message: `${error}`})
	}
	
})

export const config = {
  api: {
    externalResolver: true,
  },
}