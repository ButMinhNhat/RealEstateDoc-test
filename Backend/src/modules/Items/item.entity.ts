import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	Column,
	Entity
} from 'typeorm'

import { Category } from '../Categories/category.entity'

enum ItemType {
	NEW = 'NEW',
	USED = 'USED',
	REFURBISHED = 'REFURBISHED',
	LIMITED = 'LIMITED',
	DIGITAL = 'DIGITAL'
}

@Entity('items')
export class Item {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	code: string

	@Column()
	name: string

	@Column({ enum: ItemType, default: ItemType.NEW })
	type: string

	@Column()
	price: number

	@Column()
	description: string

	@CreateDateColumn()
	createdAt: string

	@UpdateDateColumn()
	updatedAt: string

	@DeleteDateColumn({ nullable: true })
	deletedAt?: Date

	// Relations
	@ManyToMany(() => Category, category => category.items)
	@JoinTable()
	categories: Category[]
}
