import type { AIProvider } from "@/lib/ai/provider";
import { openAICompatibleProvider } from "@/lib/ai/openAICompatibleProvider";

export function getAIProvider(): AIProvider {
  return openAICompatibleProvider;
}
