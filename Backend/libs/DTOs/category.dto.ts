import {
	ValidateNested,
	IsNotEmpty,
	IsOptional,
	IsArray,
	Matches,
	IsUUID,
	Length
} from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

// Response
export class CategoryDto {
	@ApiProperty()
	@Expose()
	id: string

	@ApiProperty()
	@Expose()
	name: string
}

// Request
export class BatchUpdateCategory {
	@ApiProperty()
	@IsUUID()
	@IsOptional()
	id: string

	@ApiProperty()
	@IsNotEmpty()
	@Length(3, 100)
	name: string
}

export class ReqBatchUpdateCategory {
	@ApiProperty({ type: [BatchUpdateCategory] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BatchUpdateCategory)
	data: BatchUpdateCategory[]
}
