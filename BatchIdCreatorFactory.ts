import IdGenerator from "./IdGenerator";
import BatchIdCreator from "./BatchIdCreator";
import checkdigit from 'checkdigit';
import Redlock from "redlock";
import { Redis } from "ioredis";

class BatchIdCreatorFactory {
    public static async create (): Promise<BatchIdCreator> {
        const prefix = process.env.ID_PREFIX ?? '';
        const idLength = process.env.ID_LENGTH ?? '';
        const redisHost = process.env.REDIS_HOST ?? '';
        const redisClient = new Redis({
            port: 6379,
            host: redisHost,
          });

        const redlock = new Redlock(
            [redisClient],
            {
            driftFactor: 0.01, 
            retryCount: 10,
            retryDelay: 100,
            retryJitter: 200,
            automaticExtensionThreshold: 500,
            }
        );

        return new BatchIdCreator(new IdGenerator(prefix, checkdigit.mod11), parseInt(idLength), redisClient, redlock)
    }
}

export default BatchIdCreatorFactory;

