import {
	ArrayNotEmpty,
	ArrayUnique,
	IsNotEmpty,
	IsOptional,
	IsNumber,
	Matches,
	Length,
	IsEnum,
	IsUUID,
	IsUrl
} from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { CategoryDto } from './category.dto'

export enum ItemType {
	NEW = 'NEW',
	USED = 'USED',
	REFURBISHED = 'REFURBISHED',
	LIMITED = 'LIMITED',
	DIGITAL = 'DIGITAL'
}

// Response
export class ItemDto {
	@ApiProperty()
	@Expose()
	id: string

	@ApiProperty()
	@Expose()
	name: string

	@ApiProperty()
	@Expose()
	avatar: string

	@ApiProperty()
	@Expose()
	type: string

	@ApiProperty()
	@Expose()
	price: number

	@ApiProperty()
	@Expose()
	description: string

	@ApiProperty()
	@Expose()
	@Type(() => CategoryDto)
	categories?: CategoryDto[]
}

export class ItemPaginationDto {
	@ApiProperty()
	@Expose()
	data: ItemDto[]

	@ApiProperty()
	@Expose()
	page: number

	@ApiProperty()
	@Expose()
	limit: number

	@ApiProperty()
	@Expose()
	total: number
}

// Request
export class UpsertItemDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(3, 100)
	name: string

	@ApiProperty()
	@IsNotEmpty()
	@IsUrl()
	avatar: string

	@ApiProperty({ default: ItemType.NEW })
	@IsEnum(ItemType)
	type: string

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	price: number

	@ApiProperty({ default: '' })
	@IsOptional()
	description: string

	@ApiProperty()
	@ArrayNotEmpty()
	@ArrayUnique()
	@IsUUID('4', { each: true })
	categoryIds: string[]
}
