import { Injectable } from '@nestjs/common';
import * as Papa from 'papaparse';
import { Response } from 'express';

@Injectable()
export class ExportService {
  async exportRepositoriesToCSV(repositories: any[], res: Response): Promise<void> {
    const filteredData = repositories.map(repo => ({
      name: repo.name,
      owner: repo.owner.login,
      stars: repo.stargazers_count,
    }));

    const csv = Papa.unparse(filteredData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`repositories_${repositories[0].owner.login}.csv`);
    res.send(csv);
  }
}
