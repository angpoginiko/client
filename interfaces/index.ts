export type User = {
  id: number
  name: string
}

export type Profile = {
	id: string
	username: string
	password: string
	repeatPassword?: string,
	email: string
	name: string
	tin?: string
	mobileNumber?: string
	address?: string
	gender?: string
	userRole: number
}

export type Token = 
{
	id: string,
	iat: number,
	exp: number
}

export type Point = {
	_id: string,
  points: number,
	dateAdded: Date,
  expiryDate: Date
}

export type ProductType = {
	_id?: string,
	productName?: string,
	unitPrice?: number,
	productType?: string,
	quantity?: number,
	productDesc?: string,
}

export type CartProduct = {
	productId: string | undefined,
	quantity: number
}


export type UserCart = {
	_id: string,
	product:  CartProduct,
	customerId: string,
	productData: ProductType[]
}