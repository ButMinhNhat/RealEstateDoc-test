import { ClassConstructor, plainToInstance } from 'class-transformer'

export const formatDTO = (classDTO: ClassConstructor<any>, data: any) =>
	plainToInstance(classDTO, data, { excludeExtraneousValues: true })
