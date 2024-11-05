import express from 'express';
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js';

const app = express();
// middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!!!');
});

app.post('/login', (req, res) => {
  res.json({user: 'user'});
});
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  try {
    const id = UserRepository.create({username, password});
    res.send({ id });
  } catch (error) {
    // normally, it is not a good idea to send the error.message
    res.status(400).send({ error: error.message });
  }
});

app.post('/logout', (req, res) => {});

app.post('/protected', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});