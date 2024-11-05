import express from 'express';
import { PORT } from './config'

const app = express();

app.get('/', (req, res) => {
  response.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});