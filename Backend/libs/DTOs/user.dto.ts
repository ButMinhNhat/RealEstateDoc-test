import { IsNotEmpty, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthReqDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(4, 50)
	@Matches(/^\S+$/, { message: `'Username' cannot contain spaces!` })
	username: string

	@ApiProperty()
	@IsNotEmpty()
	@Length(4, 50)
	@Matches(/^\S+$/, { message: `'Password' cannot contain spaces!` })
	password: string
}

export class AuthResDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	username: string

	@ApiProperty()
	createdAt: string

	@ApiProperty()
	updatedAt: string

	@ApiProperty()
	accessToken: string

	@ApiProperty()
	refreshToken: string

	constructor(partial: Partial<AuthResDto>) {
		Object.assign(this, partial)
	}
}
