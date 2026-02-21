import { QueryDto } from '../../shared/dto/query.dto';
import { ResponseFindAllDto } from '../../shared/dto/response-find-all.dto';

export abstract class FindAllAdminsUseCase {
  abstract execute(query: QueryDto): Promise<ResponseFindAllDto>;
}
