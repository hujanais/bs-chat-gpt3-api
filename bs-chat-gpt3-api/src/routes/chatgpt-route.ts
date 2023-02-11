import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import { ChatGPTController } from '../controllers/chatgpt-controller';

const chatGptController = new ChatGPTController();

router.post('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

// Public endpoint for handling Twilio webhook
router.post('/webhook', (req: Request, res: Response) => {
  const { body } = req;
  const from = body.From;
  const message = body.Body;
  console.log(`twilio-incoming: ${message}`);
  res.status(200).send('ok');
});

// Manual endpoint to ask a question to chat-gpt.
// POST /api/ask
// -- body {msg: string}
router.post('/ask', async (req: Request, res: Response) => {
  const { body } = req;
  if (!body.msg) {
    res.status(500).send('msg not found');
  } else 
  {
    const response = await chatGptController.query(body.msg);
    res.send(response);
  }
});

// Test endpoint to send a Whatsapp message.
router.get('/sendmessage', async (req: Request, res: Response) => {
  const msg: string = <string>req.query.message;
  const response = await chatGptController.sendMessage(msg);
  res.send(response);
});

export { router };
