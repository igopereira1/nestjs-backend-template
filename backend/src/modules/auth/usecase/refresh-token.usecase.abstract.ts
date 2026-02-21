import { AuthResponseDto } from '../dto/auth-response.dto';

export abstract class RefreshTokenUseCase {
  abstract execute(token: string): Promise<AuthResponseDto>;
}
