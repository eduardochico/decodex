import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ScanFile } from '../scan/scan-file.entity';

@Injectable()
export class LlmService {
  private chat: ChatOpenAI;
  constructor(@InjectRepository(ScanFile) private fileRepo: Repository<ScanFile>) {
    this.chat = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: 'gpt-4' });
  }

  async describeFile(repoStructure: string, filename: string, source: string): Promise<string> {
    const messages = [
      new SystemMessage('You analyze source code.'),
      new HumanMessage(`Structure of repository:\n${repoStructure}`),
      new HumanMessage(
        `Source code of file ${filename}:\n${source}\n\nDescribe the main responsibility of this file.`,
      ),
    ];

    const completion = await this.chat.call(messages);

    return completion.text;
  }

  async ask(scanId: number, question: string): Promise<string> {
    const files = await this.fileRepo.find({ where: { scan: { id: scanId } } });
    const context = files
      .map(
        f =>
          `File: ${f.filename}\nSource:\n${f.source}\n\nTree-sitter parse:\n${f.parse}`,
      )
      .join('\n\n');

    const messages = [
      new SystemMessage('You answer questions about code.'),
      new HumanMessage(`${context}\n\nQuestion: ${question}`),
    ];

    const completion = await this.chat.call(messages);

    return completion.text;
  }
}
