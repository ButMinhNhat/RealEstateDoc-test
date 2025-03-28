import { TypeOrmModule } from '@nestjs/typeorm'

export const DatabaseConnection = () =>
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: process.env.DATABASE_HOST || 'localhost',
		port: Number(process.env.DATABASE_PORT || '5432'),
		username: process.env.DATABASE_USER || 'test_postgre',
		password: process.env.DATABASE_PASSWORD || 'test_password',
		database: process.env.DATABASE_NAME || 'test_database',
		autoLoadEntities: true,
		synchronize: true
	})
