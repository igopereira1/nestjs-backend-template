import { Injectable } from '@nestjs/common';
import { UploadService } from './abstract-upload.service';

@Injectable()
export class MockUploadService extends UploadService {
  uploadOneFile(): Promise<{ fileKey: string; fileUrl: string }> {
    return Promise.resolve({
      fileKey: 'mock-key',
      fileUrl: 'http://mock-url.com/file.png',
    });
  }
}
