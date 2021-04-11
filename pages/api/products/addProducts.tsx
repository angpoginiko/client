import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from  '../../../utils/mongodb'


export default async function (req: NextApiRequest, res: NextApiResponse) 
{
	try {
		const { db } = await connect();
		const {
			product: {
				productName,
				unitPrice,
				productType,
				quantity,
			}
		} = req.body;
		const existingProduct = await db.collection("products").findOne({productName});
		if(existingProduct) return res.status(400).json({message: "Product already exist"});

		const products = await db.collection("products").insertOne({
			product: {
				productName,
				unitPrice,
				productType,
				quantity,
			}
		});
		res.status(200).send(products.ops[0]);
	} catch (error) {
		console.log(req.body);
		res.status(401);
		res.json({message: `${error}`})
	}
	
}
