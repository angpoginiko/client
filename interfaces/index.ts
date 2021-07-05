import { ObjectId } from 'mongodb'

export type User = {
  id: string;
  name: string;
	image?: string;
}

export type Profile = {
	_id: string
	username: string
	password: string
	repeatPassword?: string,
	email: string
	name: string
	tin?: string
	mobilenumber?: string
	address?: string
	gender?: string
	userRole?: number
	image?: FileList | string
	birthday?: Date
}

export type Token = 
{
	id: string,
	iat: number,
	exp: number
}

export type Point = {
	_id?: string,
  points: number,
	dateAdded?: Date,
  expiryDate?: Date
}

export type EncashedPoints = {
	points: number,
	dateCheckout: Date
}

export type ProductType = {
	_id?: string,
	productName?: string,
	unitPrice?: number,
	productType?: ProductTypeType,
	unitOfMeasure?: UnitOfMeasureType,
	reorderingStorageStock?: number,
	reorderingDisplayStock?: number,
	capacity?: number,
	productDesc?: string,
	image?: FileList | string,
	quantity?: number
}

export type ProductTypeType = {
	_id?: string,
	name: string
}

export type CartProductType = {
	productId: string | undefined | ObjectId,
	quantity: number,
	isAdded?: boolean,
	hasContainer?: boolean
}


export type UserCart = {
	_id: string,
	product:  CartProductType,
	customerId: string,
	productData: ProductType[],
	total?: number,
	encashedPoints?: number
}

export type Purchases = {
	cart: UserCart[],
	encashedPoints: number
	dateCheckout: Date;
	totalPrice: number;
}

export type PasswordType = {
	newpassword: string,
	oldpassword: string
}

export type ReceivedProducts = {
	expiryDate: Date,
	product: ProductType,
	productId: string,
	quantity: number,
	unitOfMeasure: UnitOfMeasureType,
	_id: string
}

export type UnitOfMeasureType = {
	_id?: string,
	name: string
}

export type StorageDisplayProductType = {
	product?: ProductType,
	quantity?: number,
	expiryDate: Date
}