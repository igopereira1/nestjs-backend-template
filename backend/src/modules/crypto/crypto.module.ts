import { Global, Module } from '@nestjs/common';
import { Argon2CryptoService } from './argon2.crypto.service';
import { CryptoService } from './abstract.crypto.service';

const CryptoServiceProvider = {
  provide: CryptoService,
  useClass: Argon2CryptoService,
};

@Global()
@Module({
  providers: [CryptoServiceProvider],
  exports: [CryptoServiceProvider],
})
export class CryptoModule {}
