import { Module, Global } from '@nestjs/common';
import { HandlebarsTemplateService } from './handlebars-template.service';
import { TemplateService } from './template.service.abstract';

const TemplateServiceProvider = {
  provide: TemplateService,
  useClass: HandlebarsTemplateService,
};

@Global()
@Module({
  providers: [TemplateServiceProvider],
  exports: [TemplateServiceProvider],
})
export class TemplateModule {}
