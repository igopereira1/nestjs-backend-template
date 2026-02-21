export abstract class TemplateService {
  abstract renderFile(
    view: string,
    context: any,
    viewPath: string,
  ): Promise<string>;
}
