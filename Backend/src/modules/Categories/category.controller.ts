import { Controller, Body, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ReqBatchUpdateCategory, CategoryDto, IsPublic, formatDTO } from 'libs'
import { CategoryService } from './category.service'

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get()
	@IsPublic()
	@ApiOperation({ summary: 'Get list Categories' })
	async getList(): Promise<CategoryDto[]> {
		const result = await this.categoryService.getList()
		return formatDTO(CategoryDto, result)
	}

	@Post()
	@ApiOperation({ summary: 'Batch update Categories' })
	async batchUpdate(
		@Body() body: ReqBatchUpdateCategory
	): Promise<CategoryDto[]> {
		const result = await this.categoryService.batchUpdate(body.data)
		return formatDTO(CategoryDto, result)
	}
}
