import Parser from 'tree-sitter';

export function buildStructure(root: Parser.SyntaxNode, source: string): string {
  const lines: string[] = [];
  const interesting = new Set([
    'import_statement',
    'class_definition',
    'function_definition',
    'method_definition',
  ]);
  function traverse(node: Parser.SyntaxNode, depth: number) {
    if (interesting.has(node.type)) {
      const text = source.slice(node.startIndex, node.endIndex).split('\n')[0].trim();
      lines.push(`${'  '.repeat(depth)}${node.type}: ${text}`);
      depth++;
    }
    for (const child of node.namedChildren) {
      traverse(child, depth);
    }
  }
  traverse(root, 0);
  return lines.join('\n');
}
