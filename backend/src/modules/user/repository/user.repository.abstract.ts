import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<User>;
  abstract getByEmail(email: string): Promise<User | null>;
  abstract update(data: UpdateUserDto, id: string): Promise<User>;
  abstract getByForgotCode(code: string): Promise<User | null>;
  abstract setForgotCode(
    id: string,
    code: string | null,
    expiresIn: Date | null,
  ): Promise<void>;
  abstract updatePassword(id: string, passwordHash: string): Promise<void>;
  abstract setConfirmationCode(
    id: string,
    code: string | null,
    expiresIn: Date | null,
  ): Promise<void>;
  abstract getByConfirmationCode(code: string): Promise<User | null>;
  abstract activateAccount(id: string): Promise<void>;
}
