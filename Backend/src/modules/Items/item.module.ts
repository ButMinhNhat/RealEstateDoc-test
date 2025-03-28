import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { Category } from '../Categories/category.entity'
import { ItemController } from './item.controller'
import { ItemService } from './item.service'
import { Item } from './item.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Item, Category])],
	controllers: [ItemController],
	providers: [ItemService]
})
export class ItemModule {}
