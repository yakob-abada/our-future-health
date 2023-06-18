import { RedisClientType } from "redis";
import Redlock from "redlock";
import { checkDigitType } from "./CheckDigitType";

class IdGenerator {
    constructor (
        private readonly prefix: string,
        private readonly checkDigit: checkDigitType,
        private readonly client: any,
        private readonly redlock: Redlock
    ) {}

    public async generate (length: number) : Promise<string> {
        let createdId = 0;
        try {
            // Acquire a lock.
            let lock = await this.redlock.acquire(["a"], 5000);

            let value = await this.client.get('id');

            if (null === value) {
                value = 0;
            }
    
            value++;

            await this.client.set('id', value);

            createdId = value
    
            console.log(value);
            await lock.release();
        } catch (e) {
            console.error("Error when trying to set:", createdId);
        }

        const createdIdString = this.padStart(createdId, length)
        return this.prefix + createdIdString + this.checkDigit.create(createdIdString);
    }

    private padStart (baseNumber: number, length: number): string {
        return (baseNumber.toString()).padStart(length, '0');
    }
}

export default IdGenerator;