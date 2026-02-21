import { InputCreateAdminDto } from '../dto/input-create-admin.dto';
import { UserResponseDto } from '../../shared/dto/user-response.dto';

export abstract class CreateAdminUseCase {
  abstract execute(data: InputCreateAdminDto): Promise<UserResponseDto>;
}
