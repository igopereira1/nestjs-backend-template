import { ResetPasswordDto } from '../dto/password-recovery.dto';

export abstract class ResetPasswordUseCase {
  abstract execute(data: ResetPasswordDto): Promise<void>;
}
