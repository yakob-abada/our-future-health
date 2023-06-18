import { Request } from 'express';
import IdGenerator from "./IdGenerator";

class IdsGenerator {
    constructor (
        private readonly idGenerator: IdGenerator,
        private readonly idNumberLength: number,
        private readonly client: any,
    ) {}

    async generate (req: Request): Promise<string[]> {
        // @todo: ids type needs to checked.
        const idsCount = parseInt(req.query.ids as string ?? '');
        const ids: string[] = []

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

        return ids
    }
}

export default IdsGenerator;