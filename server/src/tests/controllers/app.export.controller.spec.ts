import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ExportController } from '../../controllers/export.controller';
import { ExportService } from '../../services/export.service';
import { GitHubService } from '../../services/github.service';

describe('ExportController', () => {
  let exportController: ExportController;
  let gitHubService: GitHubService;
  let exportService: ExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: GitHubService,
          useValue: { getRepositories: jest.fn() },
        },
        {
          provide: ExportService,
          useValue: { exportRepositoriesToCSV: jest.fn() },
        },
      ],
    }).compile();

    exportController = module.get<ExportController>(ExportController);
    gitHubService = module.get<GitHubService>(GitHubService);
    exportService = module.get<ExportService>(ExportService);
  });

  it('deve chamar getRepositories do GitHubService', async () => {
    const username = 'testuser';
    const mockRepositories = [{ id: 1, name: 'repo1', owner: 'testuser', stars: 5 }];
    jest.spyOn(gitHubService, 'getRepositories').mockResolvedValue(mockRepositories);

    const result = await exportController.getRepositories(username);
    expect(gitHubService.getRepositories).toHaveBeenCalledWith(username);
    expect(result).toEqual(mockRepositories);
  });

  it('deve chamar exportRepositoriesToCSV do ExportService', async () => {
    const username = 'testuser';
    const mockRepositories = [{ id: 1, name: 'repo1', owner: 'testuser', stars: 5 }];
    const mockResponse = { send: jest.fn() } as unknown as Response;

    jest.spyOn(gitHubService, 'getRepositories').mockResolvedValue(mockRepositories);
    jest.spyOn(exportService, 'exportRepositoriesToCSV').mockImplementation(async () => {});

    await exportController.exportRepositories(username, mockResponse);

    expect(gitHubService.getRepositories).toHaveBeenCalledWith(username);
    expect(exportService.exportRepositoriesToCSV).toHaveBeenCalledWith(mockRepositories, mockResponse);
  });
});
