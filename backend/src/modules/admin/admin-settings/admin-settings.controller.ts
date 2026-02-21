import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';
import handleAccessControl from '../../../utils/HandleAccessControl';
import { UserResponseDto } from '../shared/dto/user-response.dto';
import { InputCreateAdminDto } from './dto/input-create-admin.dto';
import { InputUpdateAdminDto } from './dto/input-update-admin.dto';
import { PermissionResponseDto } from '../shared/dto/permission-response.dto';
import { QueryDto } from '../shared/dto/query.dto';
import { ResponseFindAllDto } from '../shared/dto/response-find-all.dto';
import { CreateAdminUseCase } from './usecase/create-admin.usecase.abstract';
import { FindAdminByIdUseCase } from './usecase/find-admin-by-id.usecase.abstract';
import { FindAllAdminsUseCase } from './usecase/find-all-admins.usecase.abstract';
import { FindAllPermissionsUseCase } from './usecase/find-all-permissions.usecase.abstract';
import { UpdateAdminUseCase } from './usecase/update-admin.usecase.abstract';

@ApiTags('Admin Settings')
@Controller('admin-settings')
export class AdminSettingsController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly findAllAdminsUseCase: FindAllAdminsUseCase,
    private readonly findAdminByIdUseCase: FindAdminByIdUseCase,
    private readonly updateAdminUseCase: UpdateAdminUseCase,
    private readonly findAllPermissionsUseCase: FindAllPermissionsUseCase,
  ) {}

  @IsPublic()
  @Get('all-permissions')
  @ApiOperation({ summary: 'Rota que recupera todas as permissões.' })
  @ApiOkResponse({ type: [PermissionResponseDto] })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findAllPermissions(): Promise<PermissionResponseDto[]> {
    return this.findAllPermissionsUseCase.execute();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Rota para criar admins no portal gerencial.',
    security: [{ bearerAuth: [] }],
  })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async create(
    @CurrentUser() user: User,
    @Body() payload: InputCreateAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'SETTINGS');

    if (file) {
      payload.file = file;
    }

    return this.createAdminUseCase.execute(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Rota que lista todos os admins cadastrados.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: ResponseFindAllDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findAllAdmins(
    @CurrentUser() user: User,
    @Query() query: QueryDto,
  ): Promise<ResponseFindAllDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'SETTINGS');

    return this.findAllAdminsUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Rota para recuperar um admin pelo seu id.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Acesso não autorizado.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findById(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'SETTINGS');

    return this.findAdminByIdUseCase.execute(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Rota para editar admin pelo id.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: InputUpdateAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'SETTINGS');

    if (file) {
      payload.file = file;
    }

    return this.updateAdminUseCase.execute(id, payload);
  }
}
