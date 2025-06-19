import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanFile } from '../scan/scan-file.entity';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScanFile])],
  providers: [LlmService],
  controllers: [LlmController],
  exports: [LlmService],
})
export class LlmModule {}
