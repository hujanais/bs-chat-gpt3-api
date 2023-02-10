import { ChatGPTAPI, ChatMessage } from 'chatgpt';
import { TwilioApi } from '../services/twilio-api';
import * as dotenv from 'dotenv';
dotenv.config();

export class ChatGPTController {
  private _api: ChatGPTAPI | undefined;
  private twilioApi: TwilioApi | undefined;

  constructor() {
    this.twilioApi = new TwilioApi();
    const apiKey = process.env.OPENAT_API_KEY || 'not-found';
    console.log('ctor', process.env.OPENAI_API_KEY);

    // this._api = new ChatGPTAPI({
    //   apiKey: apiKey,
    // });
  }

  async query(question: string): Promise<ChatMessage> {
    if (this._api) {
      const response = await this._api.sendMessage(question);
      return response;
    }
    throw new Error('this._api is undefined');
  }

  async sendMessage(message: string): Promise<any> {
    return this.twilioApi?.sendMessage(message);
  }
}
