import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'
import { authentication } from '../authentication';


export default authentication(async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			product: {
				productName,
				unitPrice,
				productType,
				soldBy,
				reorderingStorageStock,
				reorderingDisplayStock,
				capacity,
				productDesc,
			},
			image,
		} = req.body;

		const productTypeId = new ObjectId(productType);
		const unitOfMeasureId = new ObjectId(soldBy);
		
		const existingProduct = await db.collection("products").findOne({productName});
		if(existingProduct) return res.status(400).json({message: "Product already exist"});

		const products = await db.collection("products").insertOne({
			productName,
			unitPrice: parseInt(unitPrice),
			productType: productTypeId,
			unitOfMeasure: unitOfMeasureId,
			reorderingStorageStock: parseInt(reorderingStorageStock),
			reorderingDisplayStock: parseInt(reorderingDisplayStock),
			capacity: parseInt(capacity),
			productDesc,
			image
		});

		await db.collection("stock").insertOne({
			product: products.ops[0]._id,
			quantity: 0
		});

		await db.collection("display").insertOne({
			productId: products.ops[0]._id,
			productName,
			unitPrice: parseInt(unitPrice),
			productType: productTypeId,
			unitOfMeasure: unitOfMeasureId,
			reorderingStorageStock: parseInt(reorderingStorageStock),
			reorderingDisplayStock: parseInt(reorderingDisplayStock),
			capacity: parseInt(capacity),
			productDesc,
			image,
			quantity: 0
		});
		res.status(200).send(products.ops[0]);
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