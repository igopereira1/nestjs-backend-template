import { PrismaClient, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

export const seedUser = async (prisma: PrismaClient) => {
  console.log('Seeding Regular Users...');

  console.log('Seeding Regular Users...');
  const passwordHash = await argon2.hash('12345678');

  const users = [
    {
      name: 'Ada Lovelace',
      email: 'ada@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Grace Hopper',
      email: 'grace@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Bill Gates',
      email: 'bill@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Linus Torvalds',
      email: 'linus@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Pavel Shilov',
      email: 'pavel@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Steve Jobs',
      email: 'steve@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Alan Turing',
      email: 'alan@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Tim Berners-Lee',
      email: 'tim@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'James Gosling',
      email: 'james@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Guido van Rossum',
      email: 'guido@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Ken Thompson',
      email: 'ken@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Dennis Ritchie',
      email: 'dennis@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Anders Hejlsberg',
      email: 'anders@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Bjarne Stroustrup',
      email: 'bjarne@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Brendan Eich',
      email: 'brendan@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'Yukihiro Matsumoto',
      email: 'yukihiro@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
    {
      name: 'John Carmack',
      email: 'john@user.com',
      password: passwordHash,
      status: UserStatus.REGISTERED,
    },
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: userData,
      });
    }
  }

  console.log('Regular Users created successfully.');
};
