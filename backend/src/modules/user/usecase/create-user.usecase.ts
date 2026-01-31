import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { InputCreateUserDto } from '../dto/input-create-user.dto';
import { UseCase } from './base-usecase';
import { UserRepository } from '../repository/abstract-user.repository';
import { UploadService } from '../../../modules/upload/abstract-upload.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase extends UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadService: UploadService,
  ) {
    super();
  }

  async execute(data: InputCreateUserDto): Promise<User> {
    const { file, ...rest } = data;
    const dto: CreateUserDto = { ...rest };

    if (file) {
      const dataFile = await this.uploadService.uploadOneFile();
      dto.fileKey = dataFile.fileKey;
      dto.fileUrl = dataFile.fileUrl;
    }

    return this.userRepository.create(dto);
  }
}
