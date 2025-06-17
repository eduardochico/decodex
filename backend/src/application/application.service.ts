import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto, UpdateApplicationDto } from './application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private repo: Repository<Application>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: CreateApplicationDto) {
    const app = this.repo.create(dto);
    return this.repo.save(app);
  }

  async update(id: number, dto: UpdateApplicationDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
}
