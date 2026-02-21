import { UserResponseDto } from '../../shared/dto/user-response.dto';

export abstract class ToggleUserStatusUseCase {
  abstract execute(id: string): Promise<UserResponseDto>;
}
