import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Column,
	Entity
} from 'typeorm'

import { Item } from '../Items/item.entity'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ unique: true })
	username: string

	@Column()
	password: string

	@CreateDateColumn()
	createdAt: string

	@UpdateDateColumn()
	updatedAt: string

	Relations
	@OneToMany(() => Item, item => item.user)
	items: Item[]
}
