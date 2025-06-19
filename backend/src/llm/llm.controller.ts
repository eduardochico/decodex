import { Body, Controller, Param, Post } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('applications/:appId/scans/:scanId/questions')
export class LlmController {
  constructor(private service: LlmService) {}

  @Post()
  ask(@Param('scanId') scanId: string, @Body('question') question: string) {
    return this.service.ask(Number(scanId), question);
  }
}
