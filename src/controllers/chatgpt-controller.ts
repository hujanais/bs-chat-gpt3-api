import { ChatGPTAPI, ChatMessage } from 'chatgpt';

const apiKey = process.env.OPENAI_API_KEY || '';

export class ChatGPTController {
  private _api: ChatGPTAPI;

  constructor() {
    console.log('ctor', apiKey);

    this._api = new ChatGPTAPI({
      apiKey: apiKey,
    });
  }

  async query(question: string): Promise<ChatMessage> {
    const response = await this._api.sendMessage(question);
    return response;
  }
}
