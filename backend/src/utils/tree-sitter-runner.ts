import { mkdtemp, readFile, rm, readdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join, relative } from 'path';
import { spawn } from 'child_process';
import Parser from 'tree-sitter';

async function exec(cmd: string, args: string[], options: { cwd?: string } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: options.cwd });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function collectFiles(dir: string, ext: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, ext, files);
    } else if (entry.name.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

export interface FileParseResult {
  filename: string;
  source: string;
  parse: string;
}

export async function runTreeSitter(
  repoUrl: string,
  grammarModule: string,
  ext: string,
): Promise<FileParseResult[]> {
  const workDir = await mkdtemp(join(tmpdir(), 'tree-sitter-'));
  const targetDir = join(workDir, 'target');

  await exec('git', ['clone', repoUrl, targetDir]);

  const Language = require(grammarModule);
  const parser = new Parser();
  parser.setLanguage(Language);

  const files = await collectFiles(targetDir, ext);
  const results: FileParseResult[] = [];
  for (const file of files) {
    const code = await readFile(file, 'utf8');
    const tree = parser.parse(code);
    results.push({
      filename: relative(targetDir, file),
      source: code,
      parse: tree.rootNode.toString(),
    });
  }

  await rm(workDir, { recursive: true, force: true });
  return results;
}
