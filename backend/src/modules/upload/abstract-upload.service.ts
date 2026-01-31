export abstract class UploadService {
  abstract uploadOneFile(): Promise<{ fileKey: string; fileUrl: string }>;
}
