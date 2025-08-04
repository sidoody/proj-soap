/** Clip a string to ~8k GPT tokens (~32k chars), keeping start & end. */
export function clipText(s: string, maxChars = 32000) {
  if (s.length <= maxChars) return s;
  const head = s.slice(0, maxChars / 2);
  const tail = s.slice(-maxChars / 2);
  return head + "\n...\n[snip]\n...\n" + tail;
} 