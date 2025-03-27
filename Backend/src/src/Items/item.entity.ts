import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	Entity
} from 'typeorm'

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
}
