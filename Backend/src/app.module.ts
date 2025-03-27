import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CategoryModule, ItemModule, UserModule } from './modules'
import { CustomExceptionFilter, AuthGuard } from 'libs'

@Module({
	imports: [
		// Configs
		ConfigModule.forRoot({ isGlobal: true }),

		// Modules
		UserModule,
		ItemModule,
		CategoryModule
	],
	providers: [
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_PIPE, useClass: ValidationPipe },
		{ provide: APP_FILTER, useClass: CustomExceptionFilter }
	]
})
export class AppModule {}
