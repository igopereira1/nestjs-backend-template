import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CryptoService } from 'src/modules/crypto/crypto.service.abstract';
import { UserRepository } from 'src/modules/user/repository/user.repository.abstract';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from '../services/token.service';
import { LoginUseCase } from './login.usecase.abstract';

@Injectable()
export class DefaultLoginUseCase extends LoginUseCase {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  async execute(data: LoginDto): Promise<AuthResponseDto> {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const user = await this.userRepository.getByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Usuário ou senha inválido');
    }

    const isValidPassword = await this.cryptoService.compare(
      data.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Usuário ou senha inválido');
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const access_token = this.tokenService.generateAccessToken(payload);
    const refresh_token = this.tokenService.generateRefreshToken(payload);

    return {
      access_token,
      refresh_token,
    };
  }
}
