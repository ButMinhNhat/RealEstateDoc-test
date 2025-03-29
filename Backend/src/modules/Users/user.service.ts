import {
	UnauthorizedException,
	BadRequestException,
	Injectable
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

import { AuthReqDto, AuthResDto } from 'libs'
import { User } from './user.entity'

@Injectable()
export class UserService {
	private secretKey: string
	private salt: number

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private configService: ConfigService
	) {
		this.secretKey = this.configService.get<string>('JWT_SECRET_KEY') || ''
		this.salt = Number(this.configService.get<string>('BYCRYPT_SALT') || 10)
	}

	// Main services

	private generateJWT = (payload: any) =>
		jwt.sign(payload, this.secretKey, { expiresIn: '50d' })

	// Main services

	signIn = async ({ username, password }: AuthReqDto): Promise<AuthResDto> => {
		if (!username || !password)
			throw new BadRequestException('Invalid username or password!')

		// Find user and check password
		const userDetail = await this.userRepository.findOne({
			where: { username }
		})

		if (!userDetail || !(await bcrypt.compare(password, userDetail.password)))
			throw new BadRequestException('Invalid username or password!')

		return {
			...userDetail,
			accessToken: this.generateJWT({ userId: userDetail.id })
		}
	}

	signUp = async ({ username, password }: AuthReqDto): Promise<AuthResDto> => {
		if (!username || !password)
			throw new BadRequestException('Invalid username or password!')

		// hash password and save data
		const hashPassword = await bcrypt.hash(password, this.salt)
		const userEntity = this.userRepository.create({
			username,
			password: hashPassword
		})
		const resUser = await this.userRepository.save(userEntity)

		return {
			...resUser,
			accessToken: this.generateJWT({ userId: resUser.id })
		}
	}

	authentication = async (token: string): Promise<User> => {
		// verify JWT
		let userId: string
		jwt.verify(token, this.secretKey, (err, decoded) => {
			if (err) throw new UnauthorizedException(err.message)
			userId = (decoded as jwt.JwtPayload).userId || ''
		})

		// find user
		const userDetail = await this.userRepository.findOne({
			where: { id: userId }
		})
		if (!userDetail) throw new UnauthorizedException('Unauthorized')
		return userDetail
	}
}
