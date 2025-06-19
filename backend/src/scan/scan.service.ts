import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { runTreeSitter } from '../utils/tree-sitter-runner';
import { Scan } from './scan.entity';
import { ScanFile } from './scan-file.entity';
import { Application } from '../application/application.entity';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class ScanService {
  constructor(
    @InjectRepository(Scan)
    private repo: Repository<Scan>,
    @InjectRepository(ScanFile)
    private fileRepo: Repository<ScanFile>,
    @InjectRepository(Application)
    private appRepo: Repository<Application>,
    private llm: LlmService,
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

  findFiles(scanId: number) {
    return this.fileRepo.find({
      where: { scan: { id: scanId } },
      order: { id: 'ASC' },
    });
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

    const grammars: Record<string, { module: string; ext: string }> = {
      javascript: { module: 'tree-sitter-javascript', ext: '.js' },
      typescript: { module: 'tree-sitter-typescript/typescript', ext: '.ts' },
      python: { module: 'tree-sitter-python', ext: '.py' },
      go: { module: 'tree-sitter-go', ext: '.go' },
      rust: { module: 'tree-sitter-rust', ext: '.rs' },
      java: { module: 'tree-sitter-java', ext: '.java' },
      c: { module: 'tree-sitter-c', ext: '.c' },
      cpp: { module: 'tree-sitter-cpp', ext: '.cpp' },
      ruby: { module: 'tree-sitter-ruby', ext: '.rb' },
      php: { module: 'tree-sitter-php', ext: '.php' },
    };

    const grammar = grammars[app.language];
    if (!grammar) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Language not supported by tree-sitter',
      });
      return;
    }

    try {
      const results = await runTreeSitter(
        app.gitUrl,
        grammar.module,
        grammar.ext,
      );
      const filesWithAnalysis: Partial<ScanFile>[] = [];
      for (const r of results) {
        let analysis = '';
        try {
          analysis = await this.llm.describeAst(r.parse);
        } catch (e) {
          analysis = `LLM error: ${e instanceof Error ? e.message : String(e)}`;
        }
        filesWithAnalysis.push({
          scan: { id: scanId } as Scan,
          filename: r.filename,
          source: r.source,
          parse: r.parse,
          analysis,
        });
      }
      await this.fileRepo.save(filesWithAnalysis);
      await this.repo.update(scanId, { status: 'completed' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.repo.update(scanId, { status: 'error', output: message });
    }
  }
}
