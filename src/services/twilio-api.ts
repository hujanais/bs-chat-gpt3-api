import pkg from "twilio";
const { Twilio } = pkg;
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import * as dotenv from "dotenv";
dotenv.config();

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;
const FROM_NUMBER = process.env.FROM_NUMBER || "";

export class TwilioApi {
  private _client: any;

  constructor() {
    this._client = new Twilio(TWILIO_SID, TWILIO_AUTHTOKEN);
  }

  public sendMessage = async (to_number: string, message: string) => {
    const msgInstance: MessageInstance = await this._client!.messages.create({
      body: message,
      from: FROM_NUMBER,
      to: to_number,
    });

    console.log(`send-message ${msgInstance.sid}`);
    return "sendMessage - ok";
  };
}
