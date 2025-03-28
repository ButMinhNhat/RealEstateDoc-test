import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { CustomExceptionFilter } from 'libs'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// swagger
	const config = new DocumentBuilder()
		.setTitle('RealEstateDoc test')
		.setDescription('RealEstateDoc test API description')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, documentFactory, {
		swaggerOptions: {
			defaultModelsExpandDepth: -1
		}
	})

	// app configs
	const logger = new Logger(bootstrap.name)
	const configService = app.get(ConfigService)
	const port = configService.get<number>('PORT') || 8080

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidUnknownValues: true
		})
	)
	app.useGlobalFilters(new CustomExceptionFilter())

	try {
		await app.listen(port)
		logger.log(`✅ Application is running on http://localhost:${port}`)
		logger.log(`Access Swagger on http://localhost:${port}/api`)
	} catch (error) {
		logger.error(`❌ Application started failed!`, error)
	}
}
bootstrap()
