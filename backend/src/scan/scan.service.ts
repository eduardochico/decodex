import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scan } from './scan.entity';
import { Application } from '../application/application.entity';

@Injectable()
export class ScanService {
  constructor(
    @InjectRepository(Scan)
    private repo: Repository<Scan>,
  ) {}

  findForApplication(appId: number) {
    return this.repo.find({
      where: { application: { id: appId } },
      order: { id: 'DESC' },
    });
  }

  create(appId: number) {
    const scan = this.repo.create({
      application: { id: appId } as Application,
    });
    return this.repo.save(scan);
  }
}
