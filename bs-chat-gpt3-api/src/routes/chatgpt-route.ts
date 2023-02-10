import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import { ChatGPTController } from '../controllers/chatgpt-controller';

const chatGptController = new ChatGPTController();

router.post('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

// Public endpoint for handling Twilio webhook
router.post('/whats-app-webhook', (req: Request, res: Response) => {
  const { body } = req;
});

// Manual endpoint to ask a question to chat-gpt.
// POST /api/ask
// -- body {msg: string}
router.post('/ask', async (req: Request, res: Response) => {
  const response = await chatGptController.query('So glad to finally meet you!');
  res.send(response);
});

// Test endpoint to send a Whatsapp message.
router.get('/sendmessage', async (req: Request, res: Response) => {
  const msg: string = <string>req.query.message;
  const response = await chatGptController.sendMessage(msg);
  res.send(response);
});

export { router };
