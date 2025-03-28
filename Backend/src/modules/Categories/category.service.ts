import { Injectable, NotFoundException } from '@nestjs/common'
import { DataSource, In, Not, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { BatchUpdateCategory, CategoryDto } from 'libs'
import { Category } from './category.entity'

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
		private readonly dataSource: DataSource
	) {}

	// Main services

	getList = async (): Promise<CategoryDto[]> => this.categoryRepository.find()

	batchUpdate = async (
		entities: BatchUpdateCategory[]
	): Promise<CategoryDto[]> =>
		this.dataSource.transaction(async manager => {
			// Delete rows which id are not included in list
			const updateListIds = entities
				.filter(item => item.id)
				.map(item => item.id)
			await manager.softDelete(Category, { id: Not(In(updateListIds)) })

			// Upsert list
			const existedDataList = await manager.findBy(Category, {
				id: In(updateListIds)
			})
			const categoryEntities = await Promise.all(
				entities.map(async ({ id, ...item }) => {
					// Update
					if (id) {
						const existedData = existedDataList.find(data => data.id === id)
						if (!existedData)
							throw new NotFoundException(`Category not found: ${id}`)

						return Object.assign(existedData, item)
					}

					// Create
					return this.categoryRepository.create(item)
				})
			)

			return manager.save(Category, categoryEntities)
		})
}
