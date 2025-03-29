import {
	Controller,
	Delete,
	Query,
	Param,
	Post,
	Body,
	Get,
	Put,
	Req
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
		@Query('limit') limit: number = 10,
		@Query('sort') sort: string = 'DESC',
		@Query('search') search?: string
	): Promise<ItemPaginationDto> {
		return this.itemService.getPage({ page, limit, sort }, search)
	}

	@Post()
	@ApiOperation({ summary: 'Create Item' })
	async create(@Req() req: any, @Body() body: UpsertItemDto): Promise<ItemDto> {
		const result = await this.itemService.create(body, req.userId)
		return formatDTO(ItemDto, result)
	}

	@Put('/:id')
	@ApiOperation({ summary: 'Update Item' })
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() body: UpsertItemDto
	): Promise<ItemDto> {
		const result = await this.itemService.update({ id, ...body }, req.userId)
		return formatDTO(ItemDto, result)
	}

	@Delete()
	@ApiOperation({ summary: 'Delete Items' })
	async delete(@Body() body: string[]): Promise<boolean> {
		return this.itemService.delete(body)
	}
}
