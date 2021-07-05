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
			receivingProductId,
			expiryDate,
			receivingQuantity
		} = req.body;
		const product = new ObjectId(productId);
		const receivingProduct = new ObjectId(receivingProductId);

		const receiving =  await db.collection("receivingProducts").findOne({_id: receivingProduct});
		const stock =  await db.collection("stock").findOne({product: product});
		const newReceivingQuantity = receiving.quantity - parseFloat(receivingQuantity);
		const stockQuantity: number = stock.quantity + parseFloat(quantity);

		if(newReceivingQuantity === 0){
			await db.collection("receivingProducts").deleteOne({ _id: receivingProduct});
		} else {
			await db.collection("receivingProducts").findOneAndUpdate(
				{ _id: receivingProduct},
				{ $set:
						{
							quantity: newReceivingQuantity.toFixed(2)
						}
				}
			);
		}

		await db.collection("stock").findOneAndUpdate(
			{product: product},
			{ $set:
				{
					quantity: stockQuantity.toFixed(2),
					expiryDate,
				}
			}
		)
		res.status(200).send(receiving);
	} catch (error) {
		res.status(401);
		res.json({message: `${error}`})
	}
	
})