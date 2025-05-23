import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'

import { CategoryModule, ItemModule, MediaModule, UserModule } from './modules'
import { DatabaseConnection } from 'libs'
import { AuthGuard } from 'libs'

@Module({
	imports: [
		// Configs
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseConnection(),

		// Modules
		UserModule,
		ItemModule,
		CategoryModule,
		MediaModule
	],
	providers: [{ provide: APP_GUARD, useClass: AuthGuard }]
})
export class AppModule {}
