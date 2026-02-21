import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CryptoService } from 'src/modules/crypto/crypto.service.abstract';
import { UserRepository } from 'src/modules/user/repository/user.repository.abstract';
import { ResetPasswordDto } from '../dto/password-recovery.dto';
import { ResetPasswordUseCase } from './reset-password.usecase.abstract';

@Injectable()
export class DefaultResetPasswordUseCase extends ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  async execute(data: ResetPasswordDto): Promise<void> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const user = await this.userRepository.getByForgotCode(data.code);

    if (!user) {
      throw new NotFoundException('Código inválido ou inexistente.');
    }

    const passwordHash = await this.cryptoService.hash(data.password);

    await this.userRepository.updatePassword(user.id, passwordHash);
  }
}
