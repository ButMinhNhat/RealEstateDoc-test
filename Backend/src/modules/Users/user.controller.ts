import { Body, Controller, Post } from '@nestjs/common'

import { UserService } from './user.service'
import { AuthReqDto, IsPublic } from 'libs'
import { User } from './user.entity'

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('sign-in')
	@IsPublic()
	async signIn(@Body() body: AuthReqDto): Promise<User> {
		return this.userService.signIn(body)
	}

	@Post('sign-up')
	@IsPublic()
	async signUp(@Body() body: AuthReqDto): Promise<User> {
		return this.userService.signUp(body)
	}
}
