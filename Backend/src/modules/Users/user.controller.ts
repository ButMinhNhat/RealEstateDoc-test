import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthReqDto, AuthResDto, IsPublic } from 'libs'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('sign-in')
	@IsPublic()
	@HttpCode(201)
	@ApiOperation({ summary: 'Sign in to system' })
	async signIn(@Body() body: AuthReqDto): Promise<AuthResDto> {
		return this.userService.signIn(body)
	}

	@Post('sign-up')
	@IsPublic()
	@HttpCode(201)
	@ApiOperation({ summary: 'Sign up to system' })
	async signUp(@Body() body: AuthReqDto): Promise<AuthResDto> {
		return this.userService.signUp(body)
	}
}
