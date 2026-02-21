import { VerifyCodeDto } from '../dto/password-recovery.dto';

export abstract class VerifyCodeUseCase {
  abstract execute(data: VerifyCodeDto): Promise<void>;
}
