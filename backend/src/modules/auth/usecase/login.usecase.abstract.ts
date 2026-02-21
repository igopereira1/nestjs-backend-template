import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

export abstract class LoginUseCase {
  abstract execute(data: LoginDto): Promise<AuthResponseDto>;
}
