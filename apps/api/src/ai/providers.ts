import { AIProvider } from './types.js';

export class MockAIProvider implements AIProvider {
  async generateText(input: { prompt: string }) {
    return { text: `Development response for: ${input.prompt}`, provider: 'mock', model: 'mock-v1' };
  }
  async healthCheck() { return { healthy: true, provider: 'mock' }; }
}

export class OpenAIProvider implements AIProvider { constructor(private readonly apiKey: string) {} async generateText() { throw new Error(this.apiKey ? 'OpenAI adapter not wired yet' : 'OPENAI_API_KEY is not configured'); } async healthCheck() { return { healthy: Boolean(this.apiKey), provider: 'openai' }; } }
export class GeminiProvider implements AIProvider { constructor(private readonly apiKey: string) {} async generateText() { throw new Error(this.apiKey ? 'Gemini adapter not wired yet' : 'GEMINI_API_KEY is not configured'); } async healthCheck() { return { healthy: Boolean(this.apiKey), provider: 'gemini' }; } }
export class AnthropicProvider implements AIProvider { constructor(private readonly apiKey: string) {} async generateText() { throw new Error(this.apiKey ? 'Anthropic adapter not wired yet' : 'ANTHROPIC_API_KEY is not configured'); } async healthCheck() { return { healthy: Boolean(this.apiKey), provider: 'anthropic' }; } }
export class LocalAIProvider implements AIProvider { constructor(private readonly baseUrl: string) {} async generateText() { throw new Error(this.baseUrl ? 'Local AI adapter not wired yet' : 'LOCAL_AI_BASE_URL is not configured'); } async healthCheck() { return { healthy: Boolean(this.baseUrl), provider: 'local' }; } }

export function createAIProvider(): AIProvider {
  switch (process.env.AI_PROVIDER) {
    case 'openai': return new OpenAIProvider(process.env.OPENAI_API_KEY ?? '');
    case 'gemini': return new GeminiProvider(process.env.GEMINI_API_KEY ?? '');
    case 'anthropic': return new AnthropicProvider(process.env.ANTHROPIC_API_KEY ?? '');
    case 'local': return new LocalAIProvider(process.env.LOCAL_AI_BASE_URL ?? '');
    default: return new MockAIProvider();
  }
}
