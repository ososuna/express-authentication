import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { PORT, SECRET_JWT_KEY } from './config.js';
import { UserRepository } from './user-repository.js';

const app = express();

app.set('view engine', 'ejs');
// middleware
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  // this is SSR server side rendering
  res.render('index');
});

app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login({username, password});
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    );
    res
      .cookie('access_token', token, {
        httpOnly: true, // cookie can be only accessed in the server
        secure: process.env.NODE_ENV === 'production', // only https access
        sameSite: 'strict', // only in the same domain
        maxAge: 1000 * 60 * 60 // valid 1 hour
      })
      .send({ user });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});
app.post('/register', async(req, res) => {
  const { username, password } = req.body;
  try {
    const id = await UserRepository.create({username, password});
    res.send({ id });
  } catch (error) {
    // normally, it is not a good idea to send the error.message
    res.status(400).send({ error: error.message });
  }
});

app.post('/logout', (req, res) => {});

app.post('/protected', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send('access not authorized');
  }
  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    res.render('protected', data);
  } catch (error) {
    return res.status(401).send('access not authorized');
  }
  res.render('protected', { username: 'admin' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});