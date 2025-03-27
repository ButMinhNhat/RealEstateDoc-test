import { Module } from '@nestjs/common'

import { CategoryModule } from './src/Categories/category.module'
import { UserModule } from './src/Users/user.module'
import { ItemModule } from './src/Items/item.module'

@Module({
	imports: [UserModule, ItemModule, CategoryModule]
})
export class AppModule {}
