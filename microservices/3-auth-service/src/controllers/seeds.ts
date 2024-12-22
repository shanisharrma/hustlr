import crypto from 'crypto';

import { createAuthUser, getAuthUserByUsernameOrEmail } from '@auth/services/auth-service';
import { faker } from '@faker-js/faker';
import { BadRequestError, capitalize, IAuthDocument, lowerCase } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { generateUsername } from 'unique-username-generator';
import { v4 as uuidv4 } from 'uuid';
import { sample } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export async function seedUsers(req: Request, res: Response): Promise<void> {
  const { count } = req.params;
  const usernames: string[] = [];
  for (let i = 0; i < parseInt(count, 10); i++) {
    const username: string = generateUsername('', 0, 12);
    usernames.push(capitalize(username));
  }

  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i];
    const email = faker.internet.email();
    const password = 'qwertyui';
    const country = faker.location.country();
    const profilePicture = faker.image.urlPicsumPhotos();
    const userExists: IAuthDocument | undefined = await getAuthUserByUsernameOrEmail(username, email);
    if (userExists) {
      throw new BadRequestError('Invalid credentials: Email or Username', 'Seed seedUsers() method error');
    }
    const profilePublicId = uuidv4();
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');

    const authData: IAuthDocument = {
      username: capitalize(username),
      email: lowerCase(email),
      profilePublicId,
      password,
      country,
      profilePicture,
      emailVerficationToken: randomCharacters,
      emailVerified: sample([0, 1])
    } as IAuthDocument;

    await createAuthUser(authData);
  }
  res.status(StatusCodes.OK).json({ message: 'Users data seeded successfully.' });
}
