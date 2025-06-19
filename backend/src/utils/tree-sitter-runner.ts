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

  console.log(`[tree-sitter] Cloning repository ${repoUrl} into ${targetDir}`);
  await exec('git', ['clone', repoUrl, targetDir]);
  console.log('[tree-sitter] Clone completed');

  console.log(`[tree-sitter] Loading grammar module ${grammarModule}`);
  const Language = require(grammarModule);
  const parser = new Parser();
  parser.setLanguage(Language);
  console.log('[tree-sitter] Parser initialized');

  console.log(`[tree-sitter] Collecting files ending with ${ext}`);
  const files = await collectFiles(targetDir, ext);
  console.log(`[tree-sitter] Found ${files.length} files to parse`);
  const results: FileParseResult[] = [];
  for (const file of files) {
    console.log(`[tree-sitter] Parsing ${file}`);
    const code = await readFile(file, 'utf8');
    const tree = parser.parse(code);
    results.push({
      filename: relative(targetDir, file),
      source: code,
      parse: tree.rootNode.toString(),
    });
  }

  console.log('[tree-sitter] Cleaning up temporary directory');
  await rm(workDir, { recursive: true, force: true });
  console.log('[tree-sitter] Finished');
  return results;
}
