import { ForgotPasswordDto } from '../dto/password-recovery.dto';

export abstract class ForgotPasswordUseCase {
  abstract execute(data: ForgotPasswordDto): Promise<void>;
}
