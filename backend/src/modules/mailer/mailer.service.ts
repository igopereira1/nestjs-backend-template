export type TAttachImage = {
  name: string;
  path: string;
};

export abstract class MailerService {
  abstract send(
    message: string,
    from: string,
    to: string,
    subject: string,
    images?: TAttachImage[],
  ): Promise<any>;
}
