import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryController } from '../../controllers/repository.controller';
import { RepositoryService } from '../../services/repository.service';
import { ProducerService } from '../../rabbitmq/producer/repository.producer';
import { CsvService } from '../../services/csv.service';

describe('RepositoryController', () => {
  let controller: RepositoryController;
  let repositoryService: RepositoryService;
  let rabbitMQService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoryController],
      providers: [
        {
          provide: RepositoryService,
          useValue: { getRepositoriesByOwner: jest.fn() },
        },
        {
          provide: ProducerService,
          useValue: { sendToQueue: jest.fn() },
        },
        {
          provide: CsvService,
          useValue: { parseCsv: jest.fn(), generateCsv: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<RepositoryController>(RepositoryController);
    repositoryService = module.get<RepositoryService>(RepositoryService);
    rabbitMQService = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return repositories by owner', async () => {
    jest.spyOn(repositoryService, 'getRepositoriesByOwner').mockResolvedValue([
      { id: 1, name: 'repo1', owner: 'user1', stars: 5 },
    ]);    
    const result = await controller.getRepositories('user1');
    expect(result).toEqual([{ id: 1, name: 'repo1', owner: 'user1', stars: 5 }]);
    expect(repositoryService.getRepositoriesByOwner).toHaveBeenCalledWith('user1');
  });
});