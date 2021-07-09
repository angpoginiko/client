import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { customerId, productId, quantity } = req.body;
	try {
			const productIdFormatted = new ObjectId(productId.toString());
			const id = new ObjectId(customerId.toString())
			await db.collection("list").findOneAndUpdate({customerId: id, "product.productId": productIdFormatted},
					{
						$set:
							{
								"product.$.quantity": parseInt(quantity)
							}
					}
				)
			res.status(201);
		} catch (error) {
			console.log(error)
			res.status(500);
			res.json(error)
		}
	
})

export const config = {
  api: {
    externalResolver: true,
  },
}