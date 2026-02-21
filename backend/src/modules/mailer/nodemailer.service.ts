import { MailerService, TAttachImage } from './mailer.service';
import { createTransport, Transporter } from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class NodeMailerService extends MailerService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(NodeMailerService.name);

  constructor() {
    super();
    this.transporter = createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
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
        return {
          filename: path.basename(image.path),
          path: path.join(process.cwd(), 'public', image.path),
          cid: image.name,
        };
      });

      const mailOptions = {
        from: from || process.env.MAIL_FROM,
        to,
        subject,
        html: message,
        attachments,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} via Nodemailer`);
    } catch (error) {
      this.logger.error(
        `Error sending email to ${to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
