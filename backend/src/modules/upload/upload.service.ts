import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service.abstract';

@Injectable()
export class DefaultUploadService extends UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || '';
  }

  private sanitizeFileName(originalName: string): string {
    return originalName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.\-_]/g, '-')
      .toLowerCase();
  }

  async uploadOneFile(
    file: Express.Multer.File,
  ): Promise<{ fileKey: string; fileUrl: string }> {
    if (!file) {
      throw new InternalServerErrorException('No file provided for upload.');
    }

    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const key = `${Date.now()}-${sanitizedFileName}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: ObjectCannedACL.public_read,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      return { fileUrl, fileKey: key };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error uploading file to S3: ${error.message}`,
      );
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        }),
      );
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error deleting file from S3: ${error.message}`,
      );
    }
  }
}
