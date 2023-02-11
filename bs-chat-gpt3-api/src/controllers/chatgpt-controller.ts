import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';
import { TwilioApi } from '../services/twilio-api';
import * as dotenv from 'dotenv';
dotenv.config();

export class ChatGPTController {
  private _api: ChatGPTAPI | undefined;
  private twilioApi: TwilioApi | undefined;
  private _prevMsg: ChatMessage | null = null;

  constructor() {
    this.twilioApi = new TwilioApi();
    const apiKey = process.env.OPENAI_API_KEY || 'not-found';
    console.log('ctor', process.env.OPENAI_API_KEY);

    this._api = new ChatGPTAPI({
      apiKey: apiKey,
    });
  }

  reset(): void {
    console.log('new conversation');
    this._prevMsg = null;
  }

  // queue up work and get response later.
  async queryAsync(question: string): Promise<void> {
    let opt: SendMessageOptions = {
      conversationId: this._prevMsg ? this._prevMsg.conversationId : undefined,
      parentMessageId: this._prevMsg ? this._prevMsg.parentMessageId : undefined,
    };

    this._api!.sendMessage(question, opt)
      .then((chatMsg: ChatMessage) => {
        this.twilioApi?.sendMessage(chatMsg.text);
      })
      .catch((err) => {
        console.log(err);
        this.twilioApi?.sendMessage('sorry something went wrong!');
      });
  }

  /** For testing use only */
  async _query(question: string): Promise<ChatMessage> {
    if (this._api) {
      const response = await this._api.sendMessage(question);
      return response;
    }
    throw new Error('this._api is undefined');
  }

  async _sendMessage(message: string): Promise<any> {
    return this.twilioApi?.sendMessage(message);
  }
}
