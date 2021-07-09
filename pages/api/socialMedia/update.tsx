import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			links: {
				facebook,
				instagram,
				twitter
			},
		} = req.body;
		const _id = new ObjectId("60e71fb7276015344d3be139");
		await db.collection("carousel").findOneAndUpdate(
			{ _id },
			{ $set:
					{
						facebook,
						instagram,
						twitter
					}
			}
		);
		
		res.status(200);
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
