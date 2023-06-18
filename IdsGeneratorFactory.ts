import IdGenerator from "./IdGenerator";
import IdsGenerator from "./IdsGenerator";
import checkdigit from 'checkdigit';
import Redlock from "redlock";
import { Redis } from "ioredis";

class IdGeneratorFactory {
    public static async create (): Promise<IdsGenerator> {
        const prefix = process.env.ID_PREFIX ?? '';
        const idLength = process.env.ID_LENGTH ?? '';
        const redisHost = process.env.REDIS_HOST ?? '';
        const redisClient = new Redis({
            port: 6379, // Redis port
            host: redisHost, // Redis host
          });

        // Here we pass our client to redlock.
        const redlock = new Redlock(
            // You should have one client for each independent  node
            // or cluster.
            [redisClient],
            {
            // The expected clock drift; for more details see:
            // http://redis.io/topics/distlock
            driftFactor: 0.01, // multiplied by lock ttl to determine drift time
        
            // The max number of times Redlock will attempt to lock a resource
            // before erroring.
            retryCount: 10,
        
            // the time in ms between attempts
            retryDelay: 100, // time in ms
        
            // the max time in ms randomly added to retries
            // to improve performance under high contention
            // see https://www.awsarchitectureblog.com/2015/03/backoff.html
            retryJitter: 200, // time in ms
        
            // The minimum remaining time on a lock before an extension is automatically
            // attempted with the `using` API.
            automaticExtensionThreshold: 500, // time in ms
            }
        );

        return new IdsGenerator(new IdGenerator(prefix, checkdigit.mod11), parseInt(idLength), redisClient, redlock)
    }
}

export default IdGeneratorFactory;

