import { Controller, Get, Param, Post } from '@nestjs/common';
import { ScanService } from './scan.service';

@Controller('applications/:appId/scans')
export class ScanController {
  constructor(private service: ScanService) {}

  @Get()
  findAll(@Param('appId') appId: string) {
    return this.service.findForApplication(Number(appId));
  }

  @Post()
  create(@Param('appId') appId: string) {
    return this.service.create(Number(appId));
  }

  @Get(':scanId/files')
  findFiles(@Param('scanId') scanId: string) {
    return this.service.findFiles(Number(scanId));
  }
}
