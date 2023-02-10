import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import { ChatGPTController } from '../controllers/chatgpt-controller';

const chatGptController = new ChatGPTController();

router.get('/ask', async (req: Request, res: Response) => {
  const response = await chatGptController.query('So glad to finally meet you!');
  res.send(response);
});

router.get('/sendmessage', async (req: Request, res: Response) => {
  const msg: string = <string>req.query.message;
  const response = await chatGptController.sendMessage(msg);
  res.send(response);
});

export { router };
