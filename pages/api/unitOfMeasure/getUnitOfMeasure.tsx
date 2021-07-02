import { NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function ( _, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const unitOfMeasure = await db.collection("unitOfMeasure").find().toArray();
		res.status(201).send(unitOfMeasure);
	} catch (error) {
		res.status(500);
		res.json({error: `Server error`})
	}
});
