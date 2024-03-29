import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { authentication } from '../authentication';
import { CartProductType } from '../../../interfaces';

export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	const { db } = await connect();
	const { id, items, total } = req.body;
	try {
		const customerId = new ObjectId(id);
		const newItems: CartProductType[] = [];
		const itemArray = items as CartProductType[];
		itemArray.map((item) => {
			const convertedProductId = new ObjectId(item.productId);
			const newItem = {
				productId: convertedProductId,
				quantity: item.quantity,
				hasContainer: item.hasContainer
			};
			newItems.push(newItem);
		})
		const orders = await db.collection("orders").findOneAndUpdate(
			{ customerId },
			{ $set:
					{
						product : newItems,
						customerId,
						total,
						encashedPoints: 0
					}
			}
		);
		res.status(200).send(orders.value._id);
	} catch(err) {
		res.status(401).send({message: "youre not logged in"});
	}
	
})


export const config = {
  api: {
    externalResolver: true,
  },
}