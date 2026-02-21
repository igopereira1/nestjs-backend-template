import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import handleAccessControl from '../../../utils/HandleAccessControl';
import { FindAllUsersUseCase } from './usecase/find-all-users.usecase.abstract';
import { ToggleUserStatusUseCase } from './usecase/toggle-user-status.usecase.abstract';
import { FindUserByIdUseCase } from './usecase/find-user-by-id.usecase.abstract';
import { QueryDto } from '../shared/dto/query.dto';
import { ResponseFindAllDto } from '../shared/dto/response-find-all.dto';
import { UserResponseDto } from '../shared/dto/user-response.dto';

@ApiTags('Admin Users')
@Controller('admin-users')
export class AdminUsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly toggleUserStatusUseCase: ToggleUserStatusUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Rota que lista todos os usuários cadastrados.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: ResponseFindAllDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findAllUsers(
    @CurrentUser() user: User,
    @Query() query: QueryDto,
  ): Promise<ResponseFindAllDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'USERS');

    return this.findAllUsersUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Rota para recuperar um usuário pelo seu id.',
    security: [{ bearerAuth: [] }],
  })
  @ApiUnauthorizedResponse({ description: 'Acesso não autorizado.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findById(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'USERS');

    return this.findUserByIdUseCase.execute(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Rota para ativar/desativar o status de um usuário.',
    security: [{ bearerAuth: [] }],
  })
  @ApiUnauthorizedResponse({ description: 'Acesso não autorizado.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async toggleStatus(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'USERS');

    return this.toggleUserStatusUseCase.execute(id);
  }
}
