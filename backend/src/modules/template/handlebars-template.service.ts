import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as hbs from 'handlebars';
import { TemplateService } from './template.service.abstract';

@Injectable()
export class HandlebarsTemplateService extends TemplateService {
  async renderFile(
    view: string,
    context: any,
    viewPath: string,
  ): Promise<string> {
    try {
      const templatePath = path.join(viewPath, `${view}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const template = hbs.compile(templateContent);
      return template(context);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error rendering template ${view}: ${error.message}`,
      );
    }
  }
}
