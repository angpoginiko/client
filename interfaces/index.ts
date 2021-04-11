export type User = {
  id: number
  name: string
}

export type Profile = {
	id: string
	username: string
	password: string
	email: string
	name: string
	tin?: string
	mobileNumber?: string
	address?: string
	gender?: string
	repeatPassword?: string,
}

export type Token = 
{
	id: string,
	iat: number,
	exp: number
}