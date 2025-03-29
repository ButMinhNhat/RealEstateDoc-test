import {
	BadGatewayException,
	BadRequestException,
	Injectable
} from '@nestjs/common'
import { DataSource, FindOneOptions, In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Category } from '../Categories/category.entity'
import { ItemPaginationDto, UpsertItemDto } from 'libs'
import { Item } from './item.entity'

@Injectable()
export class ItemService {
	constructor(
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,

		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,

		private dataSource: DataSource
	) {}

	getCategories = async (categoryIds: string[]): Promise<Category[]> => {
		if (!categoryIds.length) throw new BadGatewayException('Empty categoryIds!')

		const result = await this.categoryRepository.find({
			where: { id: In(categoryIds) }
		})

		if (result.length !== categoryIds.length)
			throw new BadRequestException('Invalid categoryIds!')
		return result
	}

	// Main services

	getPage = async (
		pageOptions: { page: number; limit: number; sort: string },
		search?: string
	): Promise<ItemPaginationDto> => {
		const { page, limit, sort } = pageOptions

		// Create query builder
		const query = this.dataSource
			.getRepository(Item)
			.createQueryBuilder('item')
			.leftJoinAndSelect('item.categories', 'category')
			.leftJoinAndSelect('item.user', 'user')
			.orderBy('item.createdAt', sort as any)

		// Search
		if (search)
			query.andWhere(
				`(item.name ILIKE :search OR category.name ILIKE :search)`,
				{ search: `%${search}%` }
			)

		// Pagination
		query.skip((page - 1) * limit).take(limit)

		const [data, total] = await query.getManyAndCount()
		return { data, page, limit, total }
	}

	getDetail = async (options: FindOneOptions<Item>): Promise<Item> =>
		this.itemRepository.findOne({ ...options })

	create = async (
		{ categoryIds = [], ...body }: UpsertItemDto,
		userId: string
	): Promise<Item> => {
		const categories = await this.getCategories(categoryIds)
		const itemEntity = this.itemRepository.create({
			...body,
			categories,
			userId
		})

		return this.itemRepository.save(itemEntity)
	}

	update = async (
		body: UpsertItemDto & { id: string },
		userId: string
	): Promise<Item> => {
		const { id, categoryIds, ...reqBody } = body

		const existedData = await this.getDetail({
			where: { id },
			relations: ['categories']
		})
		const categories = categoryIds
			? await this.getCategories(categoryIds)
			: existedData.categories
		const updatedEntity = Object.assign(existedData, {
			...reqBody,
			categories,
			userId
		})

		return this.itemRepository.save(updatedEntity)
	}

	delete = async (ids: string[]): Promise<boolean> => {
		await this.itemRepository.softDelete({ id: In(ids) })
		return true
	}
}
