import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CryptoModule } from './modules/crypto/crypto.module';
import { TemplateModule } from './modules/template/template.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CryptoModule,
    TemplateModule,
    MailerModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
