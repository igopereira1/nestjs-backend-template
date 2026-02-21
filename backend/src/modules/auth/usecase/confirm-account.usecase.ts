import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repository/user.repository.abstract';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { ConfirmAccountUseCase } from './confirm-account.usecase.abstract';

@Injectable()
export class DefaultConfirmAccountUseCase extends ConfirmAccountUseCase {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(data: ConfirmAccountDto): Promise<void> {
    const user = await this.userRepository.getByConfirmationCode(data.code);

    if (!user) {
      throw new NotFoundException(
        'Código de confirmação inválido ou conta já ativada.',
      );
    }

    const currentDate = new Date();

    if (
      !user.confirmationCodeExpiration ||
      currentDate >= user.confirmationCodeExpiration
    ) {
      throw new UnprocessableEntityException(
        'O código de confirmação expirou!',
      );
    }

    await this.userRepository.activateAccount(user.id);
  }
}
