import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MediaService {
	private readonly bucketName = 'realestatedoc-test'
	private readonly awsS3Client = new S3Client({
		region: 'ap-northeast-1',
		credentials: {
			accessKeyId: 'AKIAWL6TE4P4EX2OZZUD',
			secretAccessKey: '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'
		}
	})

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
