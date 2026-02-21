import { Injectable } from '@nestjs/common';
import { Prisma, Role, UserStatus } from '@prisma/client';
import { CryptoService } from 'src/modules/crypto/crypto.service.abstract';
import { PageMetaDto } from 'src/modules/pagination/dtos/page-meta.dto';
import { PageDto } from 'src/modules/pagination/dtos/page.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAdminDto } from '../../admin-settings/dto/create-admin.dto';
import { QueryDto } from '../dto/query.dto';
import { UpdateAdminDto } from '../../admin-settings/dto/update-admin.dto';
import {
  AdminRepository,
  UserWithPermissions,
} from './admin.repository.abstract';

@Injectable()
export class PrismaAdminRepository extends AdminRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  async findByEmail(email: string): Promise<UserWithPermissions | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { adminPermissions: true },
    });
  }

  async findById(id: string): Promise<UserWithPermissions | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { adminPermissions: true },
    });
  }

  async findByIdAndRole(
    id: string,
    role: Role,
  ): Promise<UserWithPermissions | null> {
    return this.prisma.user.findFirst({
      where: { id, role },
      include: { adminPermissions: true },
    });
  }

  async create(data: CreateAdminDto): Promise<UserWithPermissions> {
    const { email, name, permissions, password } = data;
    const hashedPassword = await this.cryptoService.hash(password);

    const admin = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        adminPermissions: {
          connect: permissions.map((key) => ({ key })),
        },
      },
      include: { adminPermissions: true },
    });

    return admin;
  }

  async update(id: string, data: UpdateAdminDto): Promise<UserWithPermissions> {
    const { permissions, ...userPayload } = data;

    const updateData: Prisma.UserUpdateInput = {
      ...userPayload,
    };

    if (permissions) {
      updateData.adminPermissions = {
        set: [],
        connect: permissions.map((key) => ({ key })),
      };
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { adminPermissions: true },
    });
  }

  async findAll(
    query: QueryDto,
    role: Role,
  ): Promise<PageDto<UserWithPermissions>> {
    const { search } = query;
    const skip = query.skip;
    const take = query.take;

    const where: Prisma.UserWhereInput = {
      role: role,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { adminPermissions: true },
        skip,
        take,
        orderBy: { createdAt: query.order?.toLowerCase() as Prisma.SortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: query,
    });

    return new PageDto(users, pageMetaDto);
  }

  async updateStatus(id: string, status: string): Promise<UserWithPermissions> {
    return this.prisma.user.update({
      where: { id },
      data: { status: status as UserStatus },
      include: { adminPermissions: true },
    });
  }

  async findAllPermissions(): Promise<Array<{ key: string; label: string }>> {
    return this.prisma.adminPermission.findMany({
      select: {
        key: true,
        label: true,
      },
    });
  }
}
