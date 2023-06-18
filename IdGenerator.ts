import { RedisClientType } from "redis";
import Redlock from "redlock";
import { checkDigitType } from "./CheckDigitType";

class IdGenerator {
    constructor (
        private readonly prefix: string,
        private readonly checkDigit: checkDigitType
    ) {}

    public generate (value: number, length: number) : string {
        const createdIdString = this.padStart(value, length)
        return this.prefix + createdIdString + this.checkDigit.create(createdIdString);
    }

    private padStart (baseNumber: number, length: number): string {
        return (baseNumber.toString()).padStart(length, '0');
    }
}

export default IdGenerator;