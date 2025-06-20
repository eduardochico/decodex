import Parser from 'tree-sitter';

export function buildStructure(root: Parser.SyntaxNode, source: string): string {
  const lines: string[] = [];

  function traverse(node: Parser.SyntaxNode, indent = 0): void {
    const pad = '  '.repeat(indent);

    if (node.type === 'function_declaration') {
      const name = node.childForFieldName('name')?.text || '<anonymous>';
      lines.push(`${pad}function: ${name}`);
    } else if (node.type === 'class_declaration') {
      const name = node.childForFieldName('name')?.text || '<anonymous>';
      lines.push(`${pad}class: ${name}`);

      const body = node.childForFieldName('body');
      if (body) {
        body.namedChildren.forEach(child => {
          if (child.type === 'method_definition') {
            const methodName = child.childForFieldName('name')?.text || '<anonymous>';
            lines.push(`${pad}  method: ${methodName}`);
          }
        });
      }
    } else if (node.type === 'import_declaration') {
      const text = source.slice(node.startIndex, node.endIndex).trim();
      lines.push(`${pad}import: ${text}`);
    }

    node.namedChildren.forEach(child => traverse(child, indent));
  }

  traverse(root, 0);
  return lines.join('\n');
}
