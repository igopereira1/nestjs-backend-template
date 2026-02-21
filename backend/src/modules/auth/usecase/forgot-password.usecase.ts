import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { TemplateService } from 'src/modules/template/template.service.abstract';
import { UserRepository } from 'src/modules/user/repository/user.repository.abstract';
import { ForgotPasswordDto } from '../dto/password-recovery.dto';
import { ForgotPasswordUseCase } from './forgot-password.usecase.abstract';

@Injectable()
export class DefaultForgotPasswordUseCase extends ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly templateService: TemplateService,
  ) {
    super();
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async execute(data: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.getByEmail(data.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const code = this.generateCode();

    const date = new Date();
    date.setHours(date.getHours() + 4);

    await this.userRepository.setForgotCode(user.id, code, date);

    const message = await this.templateService.renderFile(
      'forgot-password',
      {
        name: user.name,
        code,
        year: new Date().getFullYear(),
      },
      'src/modules/mailer/templates',
    );
    const subject = 'Recuperação de Senha - NestJS Boilerplate';

    await this.mailerService.send(message, '', user.email, subject);
  }
}
