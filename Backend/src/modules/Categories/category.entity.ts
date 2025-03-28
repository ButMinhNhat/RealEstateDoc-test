import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	ManyToMany,
	Column,
	Entity
} from 'typeorm'

import { Item } from '../Items/item.entity'

@Entity('categories')
export class Category {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	code: string

	@Column()
	name: string

	@CreateDateColumn()
	createdAt: string

	@UpdateDateColumn()
	updatedAt: string

	@DeleteDateColumn({ nullable: true })
	deletedAt?: Date

	// Relations
	@ManyToMany(() => Item, item => item.categories)
	items: Item[]
}
