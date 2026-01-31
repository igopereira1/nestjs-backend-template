import { Global, Module } from '@nestjs/common';
import { UploadService } from './abstract-upload.service';
import { MockUploadService } from './mock-upload.service';

const UploadServiceProvider = {
  provide: UploadService,
  useClass: MockUploadService,
};

@Global()
@Module({
  providers: [UploadServiceProvider],
  exports: [UploadServiceProvider],
})
export class UploadModule {}
