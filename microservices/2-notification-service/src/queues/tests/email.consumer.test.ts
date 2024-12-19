import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages
} from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@shanisharrma/hustlr-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'auth-email-queue',
        messageCount: 0,
        consumerCount: 0
      });
      jest
        .spyOn(connection, 'createConnection')
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(
        'hustlr-email-notification',
        'direct'
      );
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        'auth-email-queue',
        'hustlr-email-notification',
        'auth-email'
      );
    });
  });

  describe('consumeOrderEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'order-email-queue',
        messageCount: 0,
        consumerCount: 0
      });
      jest
        .spyOn(connection, 'createConnection')
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createConnection();
      await consumeOrderEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(
        'hustlr-order-notification',
        'direct'
      );
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        'order-email-queue',
        'hustlr-order-notification',
        'order-email'
      );
    });
  });
});
