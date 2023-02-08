import express from 'express';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
import apiRouter from './routes/chatgpt-route';

const port = +(process.env.PORT || '3000');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
