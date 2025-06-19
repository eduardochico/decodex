import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { ScanFile } from '../scan/scan-file.entity';

@Injectable()
export class LlmService {
  private client: OpenAI;
  constructor(@InjectRepository(ScanFile) private fileRepo: Repository<ScanFile>) {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async ask(scanId: number, question: string): Promise<string> {
    const files = await this.fileRepo.find({ where: { scan: { id: scanId } } });
    const context = files
      .map(f => `File: ${f.filename}\n${f.source.substring(0, 2000)}`)
      .join('\n\n');

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You answer questions about code.' },
        { role: 'user', content: `${context}\n\nQuestion: ${question}` },
      ],
    });

    return completion.choices[0]?.message?.content || '';
  }
}
