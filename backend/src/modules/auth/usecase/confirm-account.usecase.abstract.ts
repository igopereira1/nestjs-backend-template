import { ConfirmAccountDto } from '../dto/confirm-account.dto';

export abstract class ConfirmAccountUseCase {
  abstract execute(data: ConfirmAccountDto): Promise<void>;
}
