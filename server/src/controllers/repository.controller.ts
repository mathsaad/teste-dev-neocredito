import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import * as Papa from 'papaparse';
import { FileInterceptor } from '@nestjs/platform-express';
import { RepositoryService } from '../services/repository.service';
import { ProducerService } from '../rabbitmq/producer/repository.producer';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoryController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly rabbitMQService: ProducerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os repositórios importados' })
  @ApiResponse({ status: 200, description: 'Lista de repositórios retornada com sucesso.' })
  async getRepositoriesList() {
    return this.repositoryService.getRepositories();
  }

  @Get(':owner')
  @ApiOperation({ summary: 'Listar repositórios de um usuário específico' })
  @ApiParam({ name: 'owner', description: 'Nome do usuário dono dos repositórios', example: 'mathsaad' })
  @ApiResponse({ status: 200, description: 'Lista de repositórios do usuário retornada com sucesso.' })
  async getRepositories(@Param('owner') owner: string) {
    return this.repositoryService.getRepositoriesByOwner(owner);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Importar um arquivo CSV contendo repositórios' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Arquivo importado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Apenas arquivos CSV são permitidos.' })
  async importRepositories(@UploadedFile() file: Express.Multer.File) {
    if (!file || file.mimetype !== 'text/csv' || !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Apenas arquivos CSV são permitidos.');
    }

    const csvData = file.buffer.toString();
    const parsedData = Papa.parse(csvData, { header: true }).data;

    await this.rabbitMQService.sendToQueue(parsedData);

    return { message: 'Importação iniciada! Aguarde o processamento.' };
  }
}
