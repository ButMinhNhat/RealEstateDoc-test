import {
	ExceptionFilter,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
	Catch
} from '@nestjs/common'
import { QueryFailedError } from 'typeorm'

import { Response } from 'express'

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
	private readonly logger: Logger = new Logger(CustomExceptionFilter.name)

	constructor() {}

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		const defaultError = {
			message: 'Error occurred!',
			status: HttpStatus.INTERNAL_SERVER_ERROR
		}

		// HTTP errors
		if (exception instanceof HttpException) {
			const errorResponse = exception.getResponse()
			defaultError.message = errorResponse['message']
			defaultError.status = errorResponse['statusCode']
		}

		// Database errors
		if (exception instanceof QueryFailedError) {
			defaultError.message = exception.message || 'Database error!'
			defaultError.status = HttpStatus.BAD_REQUEST
		}

		this.logger.error(`Error: ${defaultError.message}`)

		response.status(defaultError.status).json(defaultError)
	}
}
