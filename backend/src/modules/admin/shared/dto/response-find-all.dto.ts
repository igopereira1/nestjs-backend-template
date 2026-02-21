import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from '../../../pagination/dtos/page.dto';
import { UserResponseDto } from './user-response.dto';

export class ResponseFindAllDto extends PageDto<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  declare readonly data: UserResponseDto[];
}
