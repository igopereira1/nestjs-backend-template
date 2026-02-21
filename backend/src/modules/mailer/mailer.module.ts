import { Module, Global } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { NodeMailerService } from './nodemailer.service';
import { SendGridMailerService } from './sendgrid.service';

const MailerServiceProvider = {
  provide: MailerService,
  useFactory: () => {
    return process.env.MAIL_SERVICE === 'sendgrid'
      ? new SendGridMailerService()
      : new NodeMailerService();
  },
};

@Global()
@Module({
  providers: [MailerServiceProvider],
  exports: [MailerServiceProvider],
})
export class MailerModule {}
