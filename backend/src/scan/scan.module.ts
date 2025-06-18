import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scan } from './scan.entity';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scan])],
  providers: [ScanService],
  controllers: [ScanController],
})
export class ScanModule {}
