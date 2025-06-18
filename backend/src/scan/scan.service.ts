import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { runTreeSitter } from '../utils/tree-sitter-runner';
import { Scan } from './scan.entity';
import { Application } from '../application/application.entity';

@Injectable()
export class ScanService {
  constructor(
    @InjectRepository(Scan)
    private repo: Repository<Scan>,
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
  ) {}

  findForApplication(appId: number) {
    return this.repo.find({
      where: { application: { id: appId } },
      order: { id: 'DESC' },
    });
  }

  async create(appId: number) {
    const scan = this.repo.create({
      application: { id: appId } as Application,
      status: 'scanning',
    });
    await this.repo.save(scan);
    this.runScan(scan.id, appId);
    return scan;
  }

  private async runScan(scanId: number, appId: number) {
    const app = await this.appRepo.findOne({ where: { id: appId } });
    if (!app) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Application not found',
      });
      return;
    }

    if (!/^https?:\/\/.+/.test(app.gitUrl)) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Invalid repository URL',
      });
      return;
    }

    const grammarPkgs: Record<string, string> = {
      javascript: 'tree-sitter-javascript',
      typescript: 'tree-sitter-typescript',
      python: 'tree-sitter-python',
      go: 'tree-sitter-go',
      rust: 'tree-sitter-rust',
      java: 'tree-sitter-java',
      c: 'tree-sitter-c',
      cpp: 'tree-sitter-cpp',
      ruby: 'tree-sitter-ruby',
      php: 'tree-sitter-php',
    };

    const grammarPkg = grammarPkgs[app.language];
    if (!grammarPkg) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Language not supported by tree-sitter',
      });
      return;
    }

    try {
      const output = await runTreeSitter(app.gitUrl, grammarPkg);
      await this.repo.update(scanId, { status: 'completed', output });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.repo.update(scanId, { status: 'error', output: message });
    }
  }
}
