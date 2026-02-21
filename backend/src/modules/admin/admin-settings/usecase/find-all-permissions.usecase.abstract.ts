import { PermissionResponseDto } from '../../shared/dto/permission-response.dto';

export abstract class FindAllPermissionsUseCase {
  abstract execute(): Promise<PermissionResponseDto[]>;
}
