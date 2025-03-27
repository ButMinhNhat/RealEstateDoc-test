import { IsNotEmpty, Length } from 'class-validator'

export class AuthReqDto {
	@IsNotEmpty()
	@Length(6, 50)
	username: string

	@IsNotEmpty()
	@Length(6, 50)
	password: string
}
