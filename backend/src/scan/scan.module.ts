import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scan } from './scan.entity';
import { ScanFile } from './scan-file.entity';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';
import { Application } from '../application/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scan, ScanFile, Application])],
  providers: [ScanService],
  controllers: [ScanController],
})
export class ScanModule {}
