import { Test, TestingModule } from '@nestjs/testing';
import * as Papa from 'papaparse';
import { BadRequestException } from '@nestjs/common';
import { RepositoryController } from '../../controllers/repository.controller';
import { RepositoryService } from '../../services/repository.service';
import { ProducerService } from '../../rabbitmq/producer/repository.producer';

describe('RepositoryController', () => {
  let repositoryController: RepositoryController;
  let repositoryService: RepositoryService;
  let producerService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoryController],
      providers: [
        {
          provide: RepositoryService,
          useValue: { 
            getRepositories: jest.fn(), 
            getRepositoriesByOwner: jest.fn(),
          },
        },
        {
          provide: ProducerService,
          useValue: { sendToQueue: jest.fn() },
        },
      ],
    }).compile();

    repositoryController = module.get<RepositoryController>(RepositoryController);
    repositoryService = module.get<RepositoryService>(RepositoryService);
    producerService = module.get<ProducerService>(ProducerService);
  });

  it('deve chamar getRepositories do RepositoryService', async () => {
    const mockRepositories = [{ id: 1, name: 'repo1', owner: 'user1', stars: 5 }];
    jest.spyOn(repositoryService, 'getRepositories').mockResolvedValue(mockRepositories);

    const result = await repositoryController.getRepositoriesList();
    expect(repositoryService.getRepositories).toHaveBeenCalled();
    expect(result).toEqual(mockRepositories);
  });

  it('deve chamar getRepositoriesByOwner do RepositoryService', async () => {
    const owner = 'user1';
    const mockRepositories = [{ id: 1, name: 'repo1', owner: 'user1', stars: 5 }];
    jest.spyOn(repositoryService, 'getRepositoriesByOwner').mockResolvedValue(mockRepositories);

    const result = await repositoryController.getRepositories(owner);
    expect(repositoryService.getRepositoriesByOwner).toHaveBeenCalledWith(owner);
    expect(result).toEqual(mockRepositories);
  });

  it('deve lançar BadRequestException se o arquivo não for CSV', async () => {
    const file = {
      mimetype: 'application/json',
      originalname: 'data.json',
      buffer: Buffer.from(''),
    } as Express.Multer.File;

    await expect(repositoryController.importRepositories(file)).rejects.toThrow(BadRequestException);
  });

  it('deve chamar sendToQueue do ProducerService com os dados do CSV', async () => {
    const file = {
      mimetype: 'text/csv',
      originalname: 'repos.csv',
      buffer: Buffer.from('id,name,owner,stars\n1,repo1,user1,5\n2,repo2,user2,10'),
    } as Express.Multer.File;

    jest.spyOn(Papa, 'parse').mockReturnValue({
      data: [
        { id: 1, name: 'repo1', owner: 'user1', stars: 5 },
        { id: 2, name: 'repo2', owner: 'user2', stars: 10 },
      ],
    });

    await repositoryController.importRepositories(file);

    expect(producerService.sendToQueue).toHaveBeenCalledWith([
      { id: 1, name: 'repo1', owner: 'user1', stars: 5 },
      { id: 2, name: 'repo2', owner: 'user2', stars: 10 },
    ]);
  });
});
