export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  fileKey?: string;
  fileUrl?: string;
}
