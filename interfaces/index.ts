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
	customerId: string;
	dateAdded: Date;
	expiryDate: Date;
	points: number;
	_id: string
}

export type Points = {
	earned: Point[];
	encashed: EncashedPoints[];
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
	hasContainer?: boolean,
	image?: FileList | string,
	productName?: string | undefined,
	unitPrice?: number
}


export type UserCart = {
	_id: string,
	product:  CartProductType,
	customerId: string,
	productData: ProductType,
	total?: number,
	encashedPoints?: number,
	unitOfMeasure: string,
}

export type UserList = {
	_id: string,
	product:  CartProductType,
	customerId: string,
	productData: ProductType,
	total?: number,
	encashedPoints?: number,
	unitOfMeasure: string,
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
	_id: string
}

export type CarouselType = {
	_id: string,
	image1: FileList | string,
	image2: FileList | string,
	image3: FileList | string
}


export type SocialMedia = {
	_id: string,
	facebook: string,
	instagram: string,
	twitter: string
}