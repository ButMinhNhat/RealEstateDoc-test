import {
	BadGatewayException,
	BadRequestException,
	Injectable
} from '@nestjs/common'
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm'
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
		private categoryRepository: Repository<Category>
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
		pageOptions: { page: number; limit: number },
		cond: FindManyOptions<Item> = {}
	): Promise<ItemPaginationDto> => {
		const { page, limit } = pageOptions

		const [data, total] = await this.itemRepository.findAndCount({
			...cond,
			order: { createdAt: 'DESC' },
			relations: ['categories']
		})
		console.log(data.map(item => item.id))
		return { data, page, limit, total }
	}

	getDetail = async (options: FindOneOptions<Item>): Promise<Item> =>
		this.itemRepository.findOne({ ...options })

	create = async ({
		categoryIds = [],
		...body
	}: UpsertItemDto): Promise<Item> => {
		const categories = await this.getCategories(categoryIds)
		const itemEntity = this.itemRepository.create({ ...body, categories })

		return this.itemRepository.save(itemEntity)
	}

	update = async (body: UpsertItemDto & { id: string }): Promise<Item> => {
		const { id, categoryIds, ...reqBody } = body

		const existedData = await this.getDetail({
			where: { id },
			relations: ['categories']
		})
		const categories = categoryIds
			? await this.getCategories(categoryIds)
			: existedData.categories
		const updatedEntity = Object.assign(existedData, { ...reqBody, categories })

		return this.itemRepository.save(updatedEntity)
	}

	delete = async (ids: string[]): Promise<boolean> => {
		await this.itemRepository.softDelete({ id: In(ids) })
		return true
	}
}
