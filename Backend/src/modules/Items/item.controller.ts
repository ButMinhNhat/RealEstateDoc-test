import {
	Controller,
	Delete,
	Query,
	Param,
	Post,
	Body,
	Get,
	Put
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import {
	ItemPaginationDto,
	UpsertItemDto,
	formatDTO,
	IsPublic,
	ItemDto
} from 'libs'
import { ItemService } from './item.service'

@Controller('items')
@ApiTags('Items')
export class ItemController {
	constructor(private itemService: ItemService) {}

	@Get()
	@IsPublic()
	@ApiOperation({ summary: 'Get list Items' })
	async getPage(
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10
	): Promise<ItemPaginationDto> {
		return this.itemService.getPage({ page, limit }, {})
	}

	@Post()
	@ApiOperation({ summary: 'Create Item' })
	async create(@Body() body: UpsertItemDto): Promise<ItemDto> {
		const result = await this.itemService.create(body)
		return formatDTO(ItemDto, result)
	}

	@Put('/:id')
	@ApiOperation({ summary: 'Update Item' })
	async update(
		@Param('id') id: string,
		@Body() body: UpsertItemDto
	): Promise<ItemDto> {
		const result = await this.itemService.update({ id, ...body })
		return formatDTO(ItemDto, result)
	}

	@Delete()
	@ApiOperation({ summary: 'Delete Items' })
	async delete(@Body() body: string[]): Promise<boolean> {
		return this.itemService.delete(body)
	}
}
