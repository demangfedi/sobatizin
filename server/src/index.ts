import express from 'express';
import contactRouter from './routes/contact';

const app = express();

app.use(express.json());
app.use('/api/contact', contactRouter);

const port = Number(process.env.PORT ?? 4000);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
