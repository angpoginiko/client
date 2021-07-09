import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../../authentication';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const {
		query: { id },
		method
	} = req;
	const { db } = await connect();
	const _id = new ObjectId(id.toString());
	switch(method){
		case 'GET' :
			try {
				const point = await db.collection("customers").aggregate([
					{"$match" : {"_id" : _id}},
					{"$lookup" : {
						"from" : "earnedPoints",
						"localField" : "point.earned",
						"foreignField" : "_id",
						"as" : "point.earned"
					}}
				]).toArray();
				res.status(200).send(point[0].point);
			} catch(err) {
				res.status(401).send({message: "youre not logged in"});
			}
			break;
		default:

	}
	
});

export const config = {
  api: {
    externalResolver: true,
  },
}