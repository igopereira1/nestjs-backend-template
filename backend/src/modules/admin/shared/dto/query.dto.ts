import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../pagination/dtos/page-options.dto';

export class QueryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by name or email' })
  @IsOptional()
  @IsString()
  search?: string;
}
