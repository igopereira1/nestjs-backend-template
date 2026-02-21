import { CreateUserResponseDto } from '../dto/create-user-response.dto';
import { InputCreateUserDto } from '../dto/input-create-user.dto';

export abstract class CreateUserUseCase {
  abstract execute(data: InputCreateUserDto): Promise<CreateUserResponseDto>;
}
