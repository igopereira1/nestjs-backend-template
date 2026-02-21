import { Controller, Get } from '@nestjs/common';
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
import { AdminDashboardService } from './admin-dashboard.service';

@ApiTags('Admin Dashboard')
@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para obter dados do dashboard.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ description: 'Dados do dashboard recuperados com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async getDashboard(@CurrentUser() user: User) {
    handleAccessControl.verifyAdminRole(user);
    handleAccessControl.verifyPermission(user, 'DASHBOARD');

    return this.adminDashboardService.getDashboardData();
  }
}
