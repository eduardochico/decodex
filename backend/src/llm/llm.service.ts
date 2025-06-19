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

  async describeFile(source: string, parse: string): Promise<string> {
    const prompt = `The following is the source code of a file along with its tree-sitter parse.\n\nAnalyze the code and provide a functional, natural-language description that includes:\n\n1. What is the main responsibility of this file?\n2. What kind of entity does the exported class represent?\n3. What HTTP endpoints are defined and what is their purpose?\n4. What parameters are passed into these methods and where do they come from (e.g. URL, request body)?\n5. What internal services or methods are invoked by these functions?\n6. What type of user or client would interact with this code and why?\n\nSource code:\n\n${source}\n\nTree-sitter parse:\n\n${parse}`;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0]?.message?.content || '';
  }

  async ask(scanId: number, question: string): Promise<string> {
    const files = await this.fileRepo.find({ where: { scan: { id: scanId } } });
    const context = files
      .map(
        f =>
          `File: ${f.filename}\nSource:\n${f.source}\n\nTree-sitter parse:\n${f.parse}`,
      )
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
