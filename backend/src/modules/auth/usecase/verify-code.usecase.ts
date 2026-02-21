import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repository/user.repository.abstract';
import { VerifyCodeDto } from '../dto/password-recovery.dto';
import { VerifyCodeUseCase } from './verify-code.usecase.abstract';

@Injectable()
export class DefaultVerifyCodeUseCase extends VerifyCodeUseCase {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(data: VerifyCodeDto): Promise<void> {
    const user = await this.userRepository.getByForgotCode(data.code);

    if (!user) {
      throw new NotFoundException('Código inválido ou inexistente.');
    }

    const currentDate = new Date();

    if (
      !user.forgotCodeExpiration ||
      currentDate >= user.forgotCodeExpiration
    ) {
      throw new UnprocessableEntityException('O código expirou!');
    }
  }
}
