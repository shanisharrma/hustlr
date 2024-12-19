import { config } from '@notifications/config';
import { emailTemplate } from '@notifications/helpers';
import { IEmailLocals, winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'mailTransport',
  'debug'
);

export async function sendEmail(
  template: string,
  receiverEmail: string,
  locals: IEmailLocals
): Promise<void> {
  try {
    emailTemplate(template, receiverEmail, locals);
    // email templates
    logger.info('Email sent Successfully');
  } catch (error) {
    logger.log(
      'error',
      'NotificationService mailTransport sendEmail() method error:',
      error
    );
  }
}
