import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { join } from 'path';
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

    const grammarRepos: Record<string, string> = {
      javascript: 'https://github.com/tree-sitter/tree-sitter-javascript.git',
      typescript: 'https://github.com/tree-sitter/tree-sitter-typescript.git',
      python: 'https://github.com/tree-sitter/tree-sitter-python.git',
      go: 'https://github.com/tree-sitter/tree-sitter-go.git',
      rust: 'https://github.com/tree-sitter/tree-sitter-rust.git',
      java: 'https://github.com/tree-sitter/tree-sitter-java.git',
      c: 'https://github.com/tree-sitter/tree-sitter-c.git',
      cpp: 'https://github.com/tree-sitter/tree-sitter-cpp.git',
      ruby: 'https://github.com/tree-sitter/tree-sitter-ruby.git',
      php: 'https://github.com/tree-sitter/tree-sitter-php.git',
    };

    const grammarRepo = grammarRepos[app.language];
    if (!grammarRepo) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Language not supported by tree-sitter',
      });
      return;
    }

    const script = join(__dirname, '../../../scripts/run-tree-sitter.sh');
    const child = spawn('bash', [script, app.gitUrl, grammarRepo]);

    let output = '';
    child.stdout.on('data', data => {
      output += data.toString();
    });
    child.stderr.on('data', data => {
      output += data.toString();
    });

    child.on('close', async code => {
      await this.repo.update(scanId, {
        status: code === 0 ? 'completed' : 'error',
        output,
      });
    });

    child.on('error', async err => {
      output += err.message;
      await this.repo.update(scanId, {
        status: 'error',
        output,
      });
    });
  }
}
