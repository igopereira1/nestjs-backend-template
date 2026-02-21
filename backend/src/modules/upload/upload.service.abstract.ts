export abstract class UploadService {
  abstract uploadOneFile(
    file: Express.Multer.File,
  ): Promise<{ fileKey: string; fileUrl: string }>;
  abstract deleteFile(fileKey: string): Promise<void>;
}
