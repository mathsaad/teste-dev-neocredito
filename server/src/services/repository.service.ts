import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryEntity } from '../entities/repository.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(RepositoryEntity)
    private repositoryRepo: Repository<RepositoryEntity>,
  ) {}

  async getRepositories(): Promise<RepositoryEntity[]> {
    return this.repositoryRepo.find();
  }

  async getRepositoriesByOwner(owner: string): Promise<RepositoryEntity[]> {
    return this.repositoryRepo.find({ where: { owner } });
  }

  async saveRepositories(repositories: RepositoryEntity[]): Promise<void> {
    for (const repo of repositories) {
      const exists = await this.repositoryRepo.findOne({
        where: { name: repo.name, owner: repo.owner, stars: repo.stars },
      });

      if (!exists) {
        await this.repositoryRepo.save(repo);
      }
    }
  }
}