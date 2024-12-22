import { serverConfig } from '@auth/config';
import { AuthModel } from '@auth/models/auth-model';
import { publishDirectMessage } from '@auth/queues/auth-producer';
import { authChannel } from '@auth/server';
import {
  capitalize,
  IAuthBuyerMessageDetails,
  IAuthDocument,
  lowerCase,
  winstonLogger
} from '@shanisharrma/hustlr-shared';
import { sign } from 'jsonwebtoken';
import { omit } from 'lodash';
import { Model, Op } from 'sequelize';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'authService', 'debug');

export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument> {
  const result: Model = await AuthModel.create(data);
  const messageDetails: IAuthBuyerMessageDetails = {
    username: result.dataValues.username!,
    email: result.dataValues.email!,
    profilePicture: result.dataValues.profilePicture!,
    country: result.dataValues.country!,
    createdAt: result.dataValues.createdAt!,
    type: 'auth'
  };
  await publishDirectMessage(
    authChannel,
    'hustlr-buyer-update',
    'user-buyer',
    JSON.stringify(messageDetails),
    'Buyer details sent to buyer service.'
  );

  const userData: IAuthDocument = omit(result.dataValues, ['password']) as IAuthDocument;
  return userData;
}

export async function getAuthUserById(authId: number): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { id: authId },
      attributes: {
        exclude: ['passowrd']
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    logger.error(error);
  }
}

export async function getAuthUserByUsernameOrEmail(
  username: string,
  email: string
): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: {
        [Op.or]: [{ username: capitalize(username) }, { email: lowerCase(email) }]
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    logger.error(error);
  }
}

export async function getAuthUserByUsername(username: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { username: capitalize(username) }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    logger.error(error);
  }
}
export async function getAuthUserByEmail(email: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { email: lowerCase(email) }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    logger.error(error);
  }
}

export async function getAuthUserByVerificationToken(token: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { emailVerficationToken: token },
      attributes: {
        exclude: ['password']
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    logger.error(error);
  }
}

export async function getAuthUserByPasswordToken(token: string): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: {
        [Op.and]: [{ passwordResetToken: token }, { passwordResetExpires: { [Op.gt]: new Date() } }]
      }
    })) as Model;
    return user?.dataValues;
  } catch (error) {
    logger.error(error);
  }
}

export async function updateVerifyEmailField(
  authId: number,
  emailVerified: number,
  emailVerificationToken: string
): Promise<void> {
  try {
    await AuthModel.update({ emailVerified, emailVerificationToken }, { where: { id: authId } });
  } catch (error) {
    logger.error(error);
  }
}

export async function updatePasswordToken(authId: number, token: string, tokenExpiration: Date): Promise<void> {
  try {
    await AuthModel.update(
      { passwordResetToken: token, passwordResetExpires: tokenExpiration },
      { where: { id: authId } }
    );
  } catch (error) {
    logger.error(error);
  }
}

export async function updatePassword(authId: number, password: string): Promise<void> {
  try {
    await AuthModel.update(
      { password, passwordResetToken: '', passwordResetExpires: new Date() },
      { where: { id: authId } }
    );
  } catch (error) {
    logger.error(error);
  }
}

export function signToken(id: number, email: string, username: string): string {
  return sign({ id, email, username }, serverConfig.JWT_TOKEN!);
}
