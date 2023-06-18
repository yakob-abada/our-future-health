import { Request } from 'express';
import { Redis } from 'ioredis';
import Redlock from 'redlock';
import IdGenerator from "./IdGenerator";

class BatchIdCreator {
    constructor (
        private readonly idGenerator: IdGenerator,
        private readonly idNumberLength: number,
        private readonly client: Redis,
        private readonly redlock: Redlock
    ) {}

    async create (req: Request): Promise<string[]> {
        // @todo: ids type needs to checked.
        const idsCount = parseInt(req.query.ids as string);
        const ids: string[] = []

        if (Number.isNaN(idsCount) || 0 === idsCount) {
            return ids;
        }

        let lock = await this.redlock.acquire(["a"], 5000);

        try {
            let value = parseInt(await this.client.get('id') ?? '1');
            
            for (let i = 0; i < idsCount; i++) {
                const id = await this.idGenerator.generate(value, this.idNumberLength);
                ids.push(id);
    
                value++;
            }
    
            await this.client.set('id', value);
        } catch(e) {
            console.log(e)
        } finally {
            // Release the lock.
            await lock.release();
        }

        return ids
    }
}

export default BatchIdCreator;