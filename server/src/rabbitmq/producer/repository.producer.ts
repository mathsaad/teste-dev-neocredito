import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class ProducerService {
  private readonly queueName = process.env.RABBITMQ_QUEUE;

  async sendToQueue(message: any): Promise<void> {
    const connection = await amqp.connect(process.env.RABBITMQ_HOST);
    const channel = await connection.createChannel();

    await channel.assertQueue(this.queueName, { durable: true });
    channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`📤 Mensagem enviada para a fila: ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();
  }
}
