import { InputUpdateAdminDto } from '../dto/input-update-admin.dto';
import { UserResponseDto } from '../../shared/dto/user-response.dto';

export abstract class UpdateAdminUseCase {
  abstract execute(
    id: string,
    data: InputUpdateAdminDto,
  ): Promise<UserResponseDto>;
}
