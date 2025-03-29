import { IsNotEmpty, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

// Response
export class AuthResDto {
	@ApiProperty()
	@Expose()
	id: string

	@ApiProperty()
	@Expose()
	username: string

	@ApiProperty()
	@Expose()
	accessToken: string
}

// Request
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
