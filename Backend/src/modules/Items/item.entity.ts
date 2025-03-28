import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinColumn,
	JoinTable,
	ManyToOne,
	Column,
	Entity
} from 'typeorm'

import { Category } from '../Categories/category.entity'
import { User } from '../Users/user.entity'
import { ItemType } from 'libs'

@Entity('items')
export class Item {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	code: string

	@Column()
	name: string

	@Column({ enum: ItemType })
	type: string

	@Column({ default: 0 })
	price: number

	@Column({ default: '' })
	description: string

	@Column({ type: 'uuid' })
	userId: string

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

	@ManyToOne(() => User, user => user.items)
	@JoinColumn({ name: 'parentId' })
	user: User
}
