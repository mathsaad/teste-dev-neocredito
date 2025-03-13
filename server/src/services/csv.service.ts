import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class CsvService {
  generateCsv(data: any[]): string {
    const fields = Object.keys(data[0] || {});
    const parser = new Parser({ fields });
    return parser.parse(data);
  }

  async parseCsv(filePath: string): Promise<Record<string, string>[]> {
    return new Promise((resolve, reject) => {
      const results: Record<string, string>[] = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data: Record<string, string>) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }  
}