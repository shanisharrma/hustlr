import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@shanisharrma/hustlr-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';

import { sendEmail } from './mail.transport';

const logger: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

export async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'hustlr-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const hustlrQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });
    await channel.bindQueue(hustlrQueue.queue, exchangeName, routingKey);
    channel.consume(hustlrQueue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/NjCcYy0/hired-logo-4121-CDE240-seeklogo-com.png',
        username,
        verifyLink,
        resetLink
      };
      // send emails
      await sendEmail(template, receiverEmail, locals);
      // acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'NotificationService emailConsumer consumeAuthEmailMessage() method:', error);
  }
}

export async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'hustlr-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const hustlrQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });
    await channel.bindQueue(hustlrQueue.queue, exchangeName, routingKey);
    channel.consume(hustlrQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://ibb.co/9TgQYrx',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };
      // send emails
      if (template === 'orderPlaced') {
        await sendEmail(template, receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      // acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'NotificationService emailConsumer consumeOrderEmailMessage() method:', error);
  }
}
