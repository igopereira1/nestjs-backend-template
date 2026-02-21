import { AuthResponseDto } from '../dto/auth-response.dto';

export abstract class ValidateTokensUseCase {
  abstract execute(data: { authorization: string }): Promise<AuthResponseDto>;
}
