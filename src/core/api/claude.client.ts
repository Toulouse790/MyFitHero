// Placeholder pour Claude client
export class ClaudeClient {
  constructor(private apiKey?: string) {}

  async chat(messages: any[]): Promise<any> {
    // Implementation placeholder
    return { content: 'Claude response placeholder' };
  }

  async stream(messages: any[]): Promise<any> {
    // Implementation placeholder
    return { content: 'Claude streaming response placeholder' };
  }
}