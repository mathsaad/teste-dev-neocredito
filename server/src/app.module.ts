import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryModule } from './modules/repository.module';
import { RabbitMQModule } from './modules/rabbitmq.module';
import { CsvService } from './services/csv.service';
import { ExportModule } from './modules/export.module';

@Module({
  imports: [
    ConfigModule.forRoot(),  
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'mariadb',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'github_repos',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 5,
      retryDelay: 5000,
    }),
    RepositoryModule,
    ExportModule,
    RabbitMQModule,
  ],
  providers: [CsvService],
})
export class AppModule {}