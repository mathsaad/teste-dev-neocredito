import { Module } from '@nestjs/common';
import { ExportController } from '../controllers/export.controller';
import { ExportService } from '../services/export.service';
import { GitHubService } from '../services/github.service';

@Module({
  controllers: [ExportController],
  providers: [ExportService, GitHubService],
})
export class ExportModule {}
