import express from 'express';
import cors from 'cors';
import confessionRoutes from './routes/confessions';

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'https://confessly-web.vercel.app'],
  credentials: true,
}));

app.get('/ping', (req, res) => {
  res.status(200).send('awake')
});

app.use('/confessions', confessionRoutes);

export default app;
