/**
 * Strips markdown formatting and renders clean plain English text.
 */
export default function MarkdownText({ text }) {
  if (!text) return null;

  const clean = text
    // Remove **bold** markers
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // Remove `code` backticks
    .replace(/`([^`]+)`/g, '$1')
    // Convert "- item" bullets to readable lines
    .replace(/\s*[-—]\s+/g, '\n• ')
    // Convert "1. item" numbered lists
    .replace(/\s*(\d+)\.\s+/g, '\n$1. ')
    // Collapse multiple spaces
    .replace(/[ \t]+/g, ' ')
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into paragraphs on double newline, lines on single newline
  const paragraphs = clean.split(/\n\n/);

  return (
    <div className="markdown-text">
      {paragraphs.map((para, i) => (
        <p key={i} style={{ margin: '0.4rem 0' }}>
          {para.split('\n').map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
