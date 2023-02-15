import { Request, Response } from "express";

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
dotenv.config();

const TO_NUMBER = process.env.TO_NUMBER || "";

import { ChatGPTController } from "../controllers/chatgpt-controller";
import { ChatMessage } from "chatgpt";

const chatGptController = new ChatGPTController();

router.post("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Public endpoint for handling Twilio webhook
router.post("/webhook", (req: Request, res: Response) => {
  const { body } = req;
  const from = body.From;
  const message = body.Body;
  console.log(`twilio-incoming from ${from}: ${message}`);

  if (message) {
    if (message.toLowerCase() === "new") {
      // reset
      chatGptController.reset();
    } else if (message.length > 10) {
      chatGptController.queryAsync(from, message);
    } else {
      // do nothing message < 10
    }
  }

  res.status(200).send("ok"); // always return true to twilio.
});

// Manual endpoint to ask a question to chat-gpt.
// POST /api/ask
// -- body {msg: string}
router.post("/ask", async (req: Request, res: Response) => {
  const { body } = req;
  if (!body.msg) {
    res.status(500).send("msg not found");
  } else {
    const response = await chatGptController._query(body.msg);
    res.send(response);
  }
});

// Test endpoint to send a Whatsapp message.
router.get("/sendmessage", async (req: Request, res: Response) => {
  const msg: string = <string>req.query.message;
  const response = await chatGptController._sendMessage(TO_NUMBER, msg);
  res.send(response);
});

export { router };
