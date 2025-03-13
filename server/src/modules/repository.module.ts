import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from '../services/repository.service';
import { RepositoryController } from '../controllers/repository.controller';
import { RepositoryEntity } from '../entities/repository.entity';
import { RabbitMQModule } from './rabbitmq.module';
import { CsvService } from '../services/csv.service';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity]), RabbitMQModule],
  controllers: [RepositoryController],
  providers: [RepositoryService, CsvService],
})
export class RepositoryModule {}