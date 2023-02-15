import { ChatGPTAPI, ChatMessage, SendMessageOptions } from "chatgpt";
import { TwilioApi } from "../services/twilio-api";
import * as dotenv from "dotenv";
dotenv.config();

const SESSION_LIFETIME_MS = +(process.env.SESSION_LIFETIME_MS || "30000");

export class ChatGPTController {
  private _api: ChatGPTAPI | undefined;
  private twilioApi: TwilioApi | undefined;
  private _prevMsg: ChatMessage | null = null;
  private timeObj: any = null;

  constructor() {
    this.twilioApi = new TwilioApi();
    const apiKey = process.env.OPENAI_API_KEY || "not-found";
    console.log("ctor", process.env.OPENAI_API_KEY);

    this._api = new ChatGPTAPI({
      apiKey: apiKey,
    });
  }

  reset(): void {
    console.log("new conversation");
    this._prevMsg = null;
  }

  // queue up work and get response later.
  async queryAsync(to_number: string, question: string): Promise<void> {
    // stop the any running watchdog
    this.clearTimer();
    // restart the watchdog
    this.timeObj = setTimeout(() => {
      this.timeObj = null;
      this._prevMsg = null;
      console.log("watchdog - new conversation");
    }, SESSION_LIFETIME_MS);

    let opt: SendMessageOptions = {
      conversationId: this._prevMsg ? this._prevMsg.conversationId : undefined,
      parentMessageId: this._prevMsg
        ? this._prevMsg.parentMessageId
        : undefined,
    };

    this._api!.sendMessage(question, opt)
      .then((chatMsg: ChatMessage) => {
        this._prevMsg = { ...chatMsg };
        this.twilioApi?.sendMessage(to_number, chatMsg.text);
        console.log(chatMsg.text);
      })
      .catch((err) => {
        console.log(err);
        this.twilioApi?.sendMessage(to_number, "sorry something went wrong!");
      });
  }

  /** For testing use only */
  async _query(question: string): Promise<ChatMessage> {
    if (this._api) {
      const response = await this._api.sendMessage(question);
      return response;
    }
    throw new Error("this._api is undefined");
  }

  async _sendMessage(to_number: string, message: string): Promise<any> {
    return this.twilioApi?.sendMessage(to_number, message);
  }

  private clearTimer(): void {
    if (this.timeObj) {
      clearTimeout(this.timeObj);
      this.timeObj = null;
    }
  }
}
