import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from '../entities/repository.entity';
import { RepositoryService } from '../services/repository.service';
import { ProducerService } from '../rabbitmq/producer/repository.producer';
import { ConsumerService } from '../rabbitmq/consumer/repository.consumer';
import { WebSocketService } from '../services/websocket.service';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity])],
  providers: [ProducerService, ConsumerService, RepositoryService, WebSocketService],
  exports: [ProducerService],
})
export class RabbitMQModule {}