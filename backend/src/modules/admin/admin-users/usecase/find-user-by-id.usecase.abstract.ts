import { UserResponseDto } from '../../shared/dto/user-response.dto';

export abstract class FindUserByIdUseCase {
  abstract execute(id: string): Promise<UserResponseDto>;
}
