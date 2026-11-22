import { ArticleText } from './article-text';

// A small, escaped text format for headings, lists and responsive tables.
// HTML is never interpreted. Existing plain-text notices keep their renderer.
export function StructuredArticle({ text }: { text: string }) {
  const inline = (value: string) => value.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}><ArticleText text={part.slice(2, -2)} /></strong>
      : <ArticleText key={i} text={part} />);
  return <>{text.split(/\n\s*\n/).map((block, i) => {
    const lines = block.split('\n');
    if (block.startsWith('## ')) return <h2 key={i}>{inline(block.slice(3))}</h2>;
    if (lines.every(line => line.startsWith('|') && line.endsWith('|'))) {
      const rows = lines.map(line => line.slice(1, -1).split('|').map(cell => cell.trim()));
      const hasHeader = rows.length > 1 && rows[1].every(cell => /^:?-{3,}:?$/.test(cell));
      const head = hasHeader ? rows.shift() : null;
      if (hasHeader) rows.shift();
      return <div className="article-table-wrap" key={i}><table>
        {head && <thead><tr>{head.map((cell, j) => <th scope="col" key={j}>{inline(cell)}</th>)}</tr></thead>}
        <tbody>{rows.map((row, r) => <tr key={r}>{row.map((cell, c) =>
          c === 0 ? <th scope="row" key={c}>{inline(cell)}</th> : <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody>
      </table></div>;
    }
    if (lines.every(line => line.startsWith('- '))) return <ul key={i}>{lines.map((line, j) => <li key={j}>{inline(line.slice(2))}</li>)}</ul>;
    return <p key={i}>{inline(block)}</p>;
  })}</>;
}
