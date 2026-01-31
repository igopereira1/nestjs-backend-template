import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { InputCreateUserDto } from './dto/input-create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() data: InputCreateUserDto): Promise<User> {
    return await this.createUserUseCase.execute(data);
  }
}
