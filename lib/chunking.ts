/**
 * Splits text into chunks of approximately 500 tokens (~1800 characters)
 * with a small overlap to preserve contextual continuity.
 */
export function chunkText(
  text: string,
  targetChars = 1800,
  overlapChars = 200
): string[] {
  const cleaned = text.trim();
  if (!cleaned) return [];
  if (cleaned.length <= targetChars) return [cleaned];

  const chunks: string[] = [];
  const paragraphs = cleaned.split(/\n\s*\n/);
  let currentChunk = "";

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    if (currentChunk.length + trimmedPara.length + 2 <= targetChars) {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmedPara;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        // keep overlap from end of current chunk
        const overlap = currentChunk.slice(-overlapChars);
        currentChunk = overlap ? overlap + "\n\n" + trimmedPara : trimmedPara;
      } else {
        // Single paragraph exceeds targetChars, split by sentences
        const sentences = trimmedPara.split(/(?<=[.?!])\s+/);
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 1 <= targetChars) {
            currentChunk += (currentChunk ? " " : "") + sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          }
        }
      }
    }
  }

  if (currentChunk && currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
