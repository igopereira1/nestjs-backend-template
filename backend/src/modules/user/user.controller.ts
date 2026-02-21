import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { InputCreateUserDto } from './dto/input-create-user.dto';
import { CreateUserUseCase } from './usecase/create-user.usecase.abstract';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @IsPublic()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Rota para registrar um novo usuário.' })
  @ApiCreatedResponse({ type: CreateUserResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async create(
    @Body() data: InputCreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CreateUserResponseDto> {
    if (file) {
      data.file = file;
    }
    return await this.createUserUseCase.execute(data);
  }
}
