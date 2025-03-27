import {
	BadRequestException,
	ExecutionContext,
	CanActivate,
	SetMetadata,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { UserService } from 'src/modules/Users/user.service'

export const IsPublic = () => SetMetadata('isPublic', true)

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private userService: UserService,
		private reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// check public controller
		const isPublic = this.reflector.get<boolean>(
			'isPublic',
			context.getHandler()
		)
		if (isPublic) return true

		// get token
		const request = context.switchToHttp().getRequest()
		const authHeader = request.headers.authorization
		if (!authHeader) throw new BadRequestException('Missing token in headers!')
		const token: string = authHeader.split(' ')[1]

		// validate token
		const resUser = await this.userService.authentication(token)
		request.userId = resUser.id
		return true
	}
}
