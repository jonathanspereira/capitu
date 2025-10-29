import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) throw new Error("GROQ_API_KEY não está definida no .env");

const groqClient = createGroq({ apiKey: groqApiKey });
const model = groqClient('llama-3.3-70b-versatile');

export class GroqGateway {
  public async gerarSugestoes(prompt: string): Promise<string> {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });
    return text;
  }
}
