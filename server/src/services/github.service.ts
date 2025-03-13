import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GitHubService {
  private readonly githubApiUrl = 'https://api.github.com';

  async getRepositories(username: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.githubApiUrl}/users/${username}/repos`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar repositórios no GitHub',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}