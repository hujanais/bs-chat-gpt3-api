import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import { ChatGPTController } from '../controllers/chatgpt-controller';
const chatGptController = new ChatGPTController();

router.get('/query', async (req: Request, res: Response) => {
  const response = await chatGptController.query('So glad to finally meet you!');
  res.send(response);
});

export default router;
