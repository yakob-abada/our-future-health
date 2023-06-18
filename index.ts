import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import IdGeneratorFactory from './IdsGeneratorFactory';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', async (req: Request, res: Response) => {
  const generator = await IdGeneratorFactory.create();
  const result = await generator.generate(req);

  // @todo parseInt is needed to be handled better.
  res.send(`ids: ${JSON.stringify(result)}`);

  console.log(result)
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
