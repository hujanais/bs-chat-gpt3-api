import { ChatGPTAPI, ChatMessage } from 'chatgpt';

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export class ChatGPTController {
  async query(question: string): Promise<ChatMessage> {
    const response = await api.sendMessage(question);
    return response;
  }
}
