import path from 'path';

import { Logger } from 'winston';
import { IEmailLocals, winstonLogger } from '@shanisharrma/hustlr-shared';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

import { config } from './config';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'mailTransportHelper',
  'debug'
);

export async function emailTemplate(
  template: string,
  receiver: string,
  locals: IEmailLocals
): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: config.SENDER_EMAIL_HOST as string,
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const email: Email = new Email({
      message: {
        from: `Hustlr App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', './src/emails', template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    logger.error(
      'error',
      'NotificationService mailTransportHelper emailTemplate() method error:',
      error
    );
  }
}
