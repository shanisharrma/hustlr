import { sequelize } from '@auth/config';
import { IAuthDocument } from '@shanisharrma/hustlr-shared';
import { compare, hash } from 'bcryptjs';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUND = 10;

interface IAuthModelInstanceMethods extends Model {
  prototype: {
    comparePassword: (password: string, hashPassword: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<string>;
  };
}

type TAuthUserCreationAttributes = Optional<
  IAuthDocument,
  'id' | 'updatedAt' | 'passwordResetToken' | 'passwordResetExpires'
>;

const AuthModel: ModelDefined<IAuthDocument, TAuthUserCreationAttributes> & IAuthModelInstanceMethods =
  sequelize.define(
    'auths',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profilePublicId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: false
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email']
        },
        {
          unique: true,
          fields: ['username']
        },
        {
          unique: true,
          fields: ['emailVerificationToken']
        }
      ]
    }
  ) as ModelDefined<IAuthDocument, TAuthUserCreationAttributes> & IAuthModelInstanceMethods;

AuthModel.addHook('beforeCreate', 'hashPassword', async (auth: Model) => {
  const hashedPassword: string = await hash(auth.dataValues.password as string, SALT_ROUND);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
};

AuthModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

// force: true ==> always deletes the table when the server is restarted.
AuthModel.sync();
export { AuthModel };
