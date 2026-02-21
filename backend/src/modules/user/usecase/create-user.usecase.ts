import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { TemplateService } from 'src/modules/template/template.service.abstract';
import { UploadService } from 'src/modules/upload/upload.service.abstract';
import { CreateUserResponseDto } from '../dto/create-user-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { InputCreateUserDto } from '../dto/input-create-user.dto';
import { UserRepository } from '../repository/user.repository.abstract';
import { CreateUserUseCase } from './create-user.usecase.abstract';

@Injectable()
export class DefaultCreateUserUseCase extends CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadService: UploadService,
    private readonly mailerService: MailerService,
    private readonly templateService: TemplateService,
  ) {
    super();
  }

  async execute(data: InputCreateUserDto): Promise<CreateUserResponseDto> {
    const { file, ...rest } = data;
    const dto: CreateUserDto = { ...rest };

    const userExists = await this.userRepository.getByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    if (file) {
      const dataFile = await this.uploadService.uploadOneFile(file);
      dto.fileKey = dataFile.fileKey;
      dto.fileUrl = dataFile.fileUrl;
    }

    const user = await this.userRepository.create(dto);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 24);

    await this.userRepository.setConfirmationCode(user.id, code, expiresIn);

    this.sendWelcomeEmail(user.email, user.name, code).catch((err) => {
      this.logger.error(`Failed to send welcome email to ${user.email}`, err);
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      fileUrl: user.fileUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async sendWelcomeEmail(email: string, name: string, code: string) {
    const html = await this.templateService.renderFile(
      'welcome',
      { name, code, year: new Date().getFullYear() },
      'src/modules/mailer/templates',
    );

    await this.mailerService.send(
      html,
      '',
      email,
      'Bem-vindo(a) ao NestJS Boilerplate!',
    );
  }
}
