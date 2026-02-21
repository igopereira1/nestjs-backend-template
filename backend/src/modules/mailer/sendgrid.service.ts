import { MailerService, TAttachImage } from './mailer.service';
import sgMail from '@sendgrid/mail';
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SendGridMailerService extends MailerService {
  private readonly logger = new Logger(SendGridMailerService.name);

  constructor() {
    super();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async send(
    message: string,
    from: string,
    to: string,
    subject: string,
    images?: TAttachImage[],
  ): Promise<any> {
    try {
      const attachments = images?.map((image) => {
        const imagePath = path.join(process.cwd(), 'public', image.path);
        const fileContent = fs.readFileSync(imagePath).toString('base64');
        return {
          content: fileContent,
          filename: path.basename(image.path),
          type: 'image/png',
          disposition: 'inline',
          content_id: image.name,
        };
      });

      const mailOptions = {
        to,
        from: from || process.env.SENDGRID_FROM_EMAIL!,
        subject,
        html: message,
        attachments,
      };

      await sgMail.send(mailOptions);
      this.logger.log(`Email sent to ${to} via SendGrid`);
    } catch (error) {
      this.logger.error(
        `Error sending email to ${to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
