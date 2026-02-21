import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service.abstract';
import { DefaultUploadService } from './upload.service';

const UploadServiceProvider = {
  provide: UploadService,
  useClass: DefaultUploadService,
};

@Global()
@Module({
  providers: [UploadServiceProvider],
  exports: [UploadServiceProvider],
})
export class UploadModule {}
