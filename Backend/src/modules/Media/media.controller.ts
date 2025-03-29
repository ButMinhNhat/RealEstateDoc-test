import {
	InternalServerErrorException,
	BadRequestException,
	NotFoundException,
	UseInterceptors,
	UploadedFile,
	Controller,
	Post
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'

import { MediaService } from './media.service'

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post()
	@ApiOperation({ summary: 'Upload image' })
	@UseInterceptors(
		FileInterceptor('file', {
			// Check image type
			fileFilter: (req, file, cb) =>
				file.mimetype.startsWith('image/')
					? cb(null, true)
					: cb(new BadRequestException('Only allow image files!'), false)
		})
	)
	async uploadImage(@UploadedFile() file: any) {
		try {
			// Check file exists
			if (!file) throw new NotFoundException('Upload file not found!')

			// Handle upload image
			return this.mediaService.uploadImage(file)
		} catch (error) {
			throw new InternalServerErrorException('Upload fail!')
		}
	}
}
