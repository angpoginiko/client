import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			quantity,
			productId,
			expiryDate,
			capacity
		} = req.body;
		const product = new ObjectId(productId);

		const display =  await db.collection("display").findOne({productId: product});
		const displayQuantity: number = display.quantity + parseFloat(quantity);
		if(displayQuantity > capacity){
			return res.status(400).json({message: "You will be over the capacity"});
		} else {
			const stock =  await db.collection("stock").findOne({product: product});
			const stockQuantity = stock.quantity - parseFloat(quantity);
	
			await db.collection("stock").findOneAndUpdate(
				{product: product},
				{ $set:
					{
						quantity: stockQuantity.toFixed(2),
						expiryDate,
					}
				}
			)
	
			await db.collection("display").findOneAndUpdate(
				{productId: product},
				{ $set:
					{
						quantity: displayQuantity.toFixed(2),
						expiryDate,
					}
				}
			)
			
			res.status(200).send({message: "done!"});
		}
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