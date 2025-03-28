import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ReqBatchUpdateCategory, CategoryDto, IsPublic } from 'libs'
import { CategoryService } from './category.service'

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get()
	@IsPublic()
	@ApiOperation({ summary: 'Get list Categories' })
	async getList(): Promise<CategoryDto[]> {
		return this.categoryService.getList()
	}

	@Post()
	@ApiOperation({ summary: 'Batch update Categories' })
	async batchUpdate(
		@Body() body: ReqBatchUpdateCategory
	): Promise<CategoryDto[]> {
		return this.categoryService.batchUpdate(body.data)
	}
}
