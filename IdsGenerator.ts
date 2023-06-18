import { Request } from 'express';
import Redlock from 'redlock';
import IdGenerator from "./IdGenerator";

class IdsGenerator {
    constructor (
        private readonly idGenerator: IdGenerator,
        private readonly idNumberLength: number,
        private readonly client: any,
        private readonly redlock: Redlock
    ) {}

    async generate (req: Request): Promise<string[]> {
        // @todo: ids type needs to checked.
        const idsCount = parseInt(req.query.ids as string);
        const ids: string[] = []

        if (Number.isNaN(idsCount) || 0 === idsCount) {
            return ids;
        }

        let lock = await this.redlock.acquire(["a"], 5000);

        try {
            let value = await this.client.get('id');

            if (null === value) {
                value = 1;
            }
            
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

export default IdsGenerator;