export function undent(text) {
  let indent;

  return text.split('\n').map((line) => {
    if (indent === undefined && line.trim()) {
      indent = line.match(/^\s*/)?.[0] || '';
    }
    if (line.startsWith(indent)) {
      return line.slice(indent.length);
    }
    return line;
  }).join('\n').trim();
}
