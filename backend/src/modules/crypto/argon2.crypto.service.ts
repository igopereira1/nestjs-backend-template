import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CryptoService } from './crypto.service.abstract';

@Injectable()
export class Argon2CryptoService extends CryptoService {
  async hash(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await argon2.verify(encrypted, data);
  }
}
