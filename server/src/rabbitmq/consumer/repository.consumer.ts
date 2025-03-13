import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RepositoryService } from '../../services/repository.service';
import { WebSocketService } from '../../services/websocket.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly queueName = 'repository_import';

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly webSocketService: WebSocketService
  ) {}

  async onModuleInit() {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertQueue(this.queueName, { durable: true });
    console.log('🎧 Consumer aguardando mensagens...');

    channel.consume(this.queueName, async (msg) => {
      if (msg !== null) {
        const repositories = JSON.parse(msg.content.toString());
        console.log(`📥 Processando repositórios: ${repositories.length} itens`);

        await this.repositoryService.saveRepositories(repositories);

        console.log('✅ Processamento concluído!');
        channel.ack(msg);
        
        this.webSocketService.sendProcessingComplete();
      }
    });
  }
}
