import Papa from "papaparse";
import type { ChatCompletionMessageParam } from "openai/resources";

export function csvToChat(csv: string): ChatCompletionMessageParam[] {
  const { data } = Papa.parse<string[]>(csv.trim(), { header: false });
  return (data as string[][])
    .map(r => r[0])
    .filter(Boolean)
    .map(line => {
      const [, speaker, content] =
        line.match(/\]\s*(User|Assistant):\s*(.*)$/i) ?? [];
      const role = speaker?.toLowerCase() === "assistant" ? "assistant" : "user";
      return {
        role: role as "user" | "assistant",
        content: content ?? line,
      } as ChatCompletionMessageParam;
    });
} 