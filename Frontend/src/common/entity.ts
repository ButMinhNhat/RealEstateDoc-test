export interface AuthReqDto {
	username: string 
	password: string
}

export interface UserDto {
	id: string
	username: string
}

export interface CategoryDto {
    id?: string
	name: string
}

export interface ItemDto {
	id: string
	name: string
	avatar: string
	type: string
	price: number
	description: string
	categories: CategoryDto[]
	user: UserDto
}

export interface ItemPaginationDto {
    data: ItemDto[],
    page: number, 
    limit: number,
    total: number,
	sort: string, 
	search: string 
}

export interface ItemFormDataDto {
	id?: string,
	name: string,
	avatar: string,
	type: string,
	price: number,
	description: string,
	categoryIds: string[],
}

export interface FormDataDto {
	type: string 
	data: ItemFormDataDto
}

export interface OpenModal { 
	authModal: boolean 
	sideModal: boolean 
}
