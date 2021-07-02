import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			receivingProducts: {
				quantity,
				unitOfMeasure,
				expiryDate
			},
			productId,
		} = req.body;

		const id = new ObjectId(productId);
	
		const products = await db.collection("receivingProducts").insertOne({
			quantity: parseInt(quantity),
			unitOfMeasure: parseInt(unitOfMeasure),
			expiryDate,
			productId: id
		});
		
		res.status(200).send(products.ops[0]);
	} catch (error) {
		res.status(401);
		res.json({message: `${error}`})
	}
	
})
