import { Request } from 'express';
import IdGenerator from "./IdGenerator";

class IdsGenerator {
    constructor (
        private readonly idGenerator: IdGenerator,
        private readonly idNumberLength: number,
    ) {}

    async generate (req: Request): Promise<string[]> {
        // @todo: ids type needs to checked.
        const idsCount = parseInt(req.query.ids as string ?? '');
        const ids: string[] = []
        
        for (let i = 0; i < idsCount; i++) {
            const id = await this.idGenerator.generate(this.idNumberLength);
            ids.push(id);
        }

        return ids
    }
}

export default IdsGenerator;