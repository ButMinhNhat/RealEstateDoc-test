import { Injectable, NotFoundException } from '@nestjs/common'
import { DataSource, In, Not, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Category } from './category.entity'
import { BatchUpdateCategory } from 'libs'

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
		private readonly dataSource: DataSource
	) {}

	// Main services

	getList = async (): Promise<Category[]> =>
		this.categoryRepository.find({ order: { createdAt: 'DESC' } })

	batchUpdate = async (body: BatchUpdateCategory[]): Promise<Category[]> =>
		this.dataSource.transaction(async manager => {
			// Delete rows which id are not included in list
			const updateListIds = body.filter(item => item.id).map(item => item.id)
			await manager.softDelete(Category, { id: Not(In(updateListIds)) })

			// Upsert list
			const existedDataList = await manager.findBy(Category, {
				id: In(updateListIds)
			})
			const categoryEntities = await Promise.all(
				body.map(async ({ id, ...item }) => {
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
			const result = await manager.save(Category, categoryEntities)
			return result.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
		})
}
