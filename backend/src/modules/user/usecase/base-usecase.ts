export abstract class UseCase {
  abstract execute(data: any): Promise<any>;
}
