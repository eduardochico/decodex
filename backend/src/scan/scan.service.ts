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
      stage: 'Queued',
      progress: 0,
    });
    await this.repo.save(scan);
    await this.appRepo.update(appId, { status: 'warning' });
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
    console.log(`[scan] Starting scan ${scanId} for application ${appId}`);
    await this.repo.update(scanId, { stage: 'Preparing', progress: 0 });
    const app = await this.appRepo.findOne({ where: { id: appId } });
    if (!app) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Application not found',
        stage: 'Error',
        progress: 0,
      });
      await this.appRepo.update(appId, { status: 'error' });
      console.log(`[scan] Application ${appId} not found`);
      return;
    }
    console.log(`[scan] Using repository URL ${app.gitUrl}`);

    if (!/^https?:\/\/.+/.test(app.gitUrl)) {
      await this.repo.update(scanId, {
        status: 'error',
        output: 'Invalid repository URL',
        stage: 'Error',
        progress: 0,
      });
      await this.appRepo.update(appId, { status: 'error' });
      console.log('[scan] Invalid repository URL');
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
        stage: 'Error',
        progress: 0,
      });
      await this.appRepo.update(appId, { status: 'error' });
      console.log(`[scan] Language ${app.language} not supported`);
      return;
    }
    console.log(`[scan] Using grammar ${grammar.module} with extension ${grammar.ext}`);

    try {
      await this.repo.update(scanId, { stage: 'Running tree-sitter', progress: 25 });
      const results = await runTreeSitter(app.gitUrl, grammar.module, grammar.ext);
      console.log(`[scan] runTreeSitter returned ${results.length} results`);
      await this.repo.update(scanId, { stage: 'Analyzing files', progress: 50 });
      const repoParse = results
        .map(r => `File: ${r.filename}\n${r.parse}`)
        .join('\n\n');
      const filesWithAnalysis: Partial<ScanFile>[] = [];
      for (const [index, r] of results.entries()) {
        let analysis = '';
        // analysis = await this.llm.describeFile(repoParse, r.filename, r.source);
        filesWithAnalysis.push({
          scan: { id: scanId } as Scan,
          filename: r.filename,
          source: r.source,
          parse: r.parse,
          structure: r.structure,
          analysis,
        });
        const progress = 50 + Math.round(((index + 1) / results.length) * 50);
        await this.repo.update(scanId, {
          stage: `Analyzing files (${index + 1}/${results.length})`,
          progress,
        });
      }
      await this.fileRepo.save(filesWithAnalysis);
      await this.repo.update(scanId, { status: 'completed', stage: 'Completed', progress: 100 });
      await this.appRepo.update(appId, { status: 'ok' });
      console.log(`[scan] Scan ${scanId} completed`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.repo.update(scanId, {
        status: 'error',
        output: message,
        stage: 'Error',
        progress: 0,
      });
      await this.appRepo.update(appId, { status: 'error' });
      console.log(`[scan] Scan ${scanId} failed: ${message}`);
    }
  }
}
