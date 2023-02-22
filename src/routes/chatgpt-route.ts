import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import * as dotenv from 'dotenv';
dotenv.config();

const TO_NUMBER = process.env.TO_NUMBER || '';

import { ChatGPTController } from '../controllers/chatgpt-controller';
import { ChatMessage } from 'chatgpt';

const chatGptController = new ChatGPTController();

router.post('/ping', (req: Request, res: Response) => {
  res.send({
    conversationId: 'd4acedc0-4de0-48a2-9eda-3491c9794731',
    id: 'cmpl-6lTlUjvZBuhkb5XwjDD3n8cUaiAMw',
    parentMessageId: '3038ee46-7b8f-4bbb-a798-431f64bf0212',
    role: 'assistant',
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  });
});

// Public endpoint for handling Twilio webhook
router.post('/webhook', (req: Request, res: Response) => {
  const { body } = req;
  const from = body.From;
  const message = body.Body;
  console.log(`twilio-incoming from ${from}: ${message}`);

  if (message) {
    if (message.toLowerCase() === 'new') {
      // reset
      chatGptController.reset();
    } else if (message.length > 10) {
      chatGptController.queryAsync(from, message);
    } else {
      // do nothing message < 10
    }
  }

  res.status(200).send('ok'); // always return true to twilio.
});

// Manual endpoint to ask a question to chat-gpt.
// POST /api/ask
// -- body {msg: string}
router.post('/ask', async (req: Request, res: Response) => {
  const { body } = req;
  if (!body.msg) {
    res.status(500).send('msg not found');
  } else {
    const response = await chatGptController._query(body.msg);
    res.send(response);
  }
});

// Test endpoint to send a Whatsapp message.
router.get('/sendmessage', async (req: Request, res: Response) => {
  const msg: string = <string>req.query.message;
  const response = await chatGptController._sendMessage(TO_NUMBER, msg);
  res.send(response);
});

export { router };
