import { UserResponseDto } from '../../shared/dto/user-response.dto';

export abstract class FindAdminByIdUseCase {
  abstract execute(id: string): Promise<UserResponseDto>;
}
