import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class MediaService {
	private readonly awsS3Client: S3Client
	private readonly bucketName: string

	constructor(private readonly configService: ConfigService) {
		this.awsS3Client = new S3Client({
			region: this.configService.get('AWS_S3_REGION'),
			credentials: {
				accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
				secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY')
			}
		})
		this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME')
	}

	getFileUrl = (fileName: string) =>
		`https://${this.bucketName}.s3.amazonaws.com/${fileName}`

	async uploadImage(file: any): Promise<{ imageUrl: string }> {
		const fileName = `images/${Date.now().toString()}-${file.originalname}`

		await this.awsS3Client.send(
			new PutObjectCommand({
				Bucket: this.bucketName,
				Key: fileName,
				Body: file.buffer,
				ContentType: file.mimetype,
				ContentLength: file.size
			})
		)
		return { imageUrl: this.getFileUrl(fileName) }
	}
}
