import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from '../services/export.service';
import { GitHubService } from '../services/github.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Export') 
@Controller('export')
export class ExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly gitHubService: GitHubService,
  ) {}

  @Get('repositories/:username')
  @ApiOperation({ summary: 'Obter todos os repositórios públicos de um usuário do GitHub' })
  @ApiParam({ name: 'username', description: 'Nome do usuário no GitHub', example: 'mathsaad' })
  @ApiResponse({ status: 200, description: 'Lista de repositórios do usuário retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado no GitHub.' })
  async getRepositories(@Param('username') username: string) {
    return this.gitHubService.getRepositories(username);
  }

  @Get('repositories/:username/csv')
  @ApiOperation({ summary: 'Exportar os repositórios de um usuário para CSV' })
  @ApiParam({ name: 'username', description: 'Nome do usuário no GitHub', example: 'mathsaad' })
  @ApiResponse({ status: 200, description: 'CSV gerado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado no GitHub.' })
  async exportRepositories(@Param('username') username: string, @Res() res: Response) {
    const repositories = await this.gitHubService.getRepositories(username);
    await this.exportService.exportRepositoriesToCSV(repositories, res);
  }
}
