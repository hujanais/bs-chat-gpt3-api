import * as dotenv from 'dotenv';
dotenv.config();

import { ChatGPTAPI, ChatMessage } from 'chatgpt';

export class ChatGPTController {
  private _api: ChatGPTAPI | undefined;

  constructor() {
    const apiKey = process.env.PORT || 'not-found';
    console.log('ctor', process.env.OPENAI_API_KEY);

    this._api = new ChatGPTAPI({
      apiKey: apiKey,
    });
  }

  async query(question: string): Promise<ChatMessage> {
    if (this._api) {
      const response = await this._api.sendMessage(question);
      return response;
    }
    throw new Error('this._api is undefined');
  }
}
