import { PartialType } from '@nestjs/swagger';
import { InputCreateAdminDto } from './input-create-admin.dto';

export class InputUpdateAdminDto extends PartialType(InputCreateAdminDto) {}
