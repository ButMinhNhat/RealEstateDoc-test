import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { ItemController } from './item.controller'
import { ItemService } from './item.service'
import { Item } from './item.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Item])],
	controllers: [ItemController],
	providers: [ItemService]
})
export class ItemModule {}
