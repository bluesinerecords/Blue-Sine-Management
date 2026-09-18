export interface AIProvider {
  generateText(input: { prompt: string }): Promise<{ text: string; provider: string; model: string }>;
  healthCheck(): Promise<{ healthy: boolean; provider: string }>;
}
