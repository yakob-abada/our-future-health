"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class IdGenerator {
    constructor(prefix, checkDigit, client, redlock) {
        this.prefix = prefix;
        this.checkDigit = checkDigit;
        this.client = client;
        this.redlock = redlock;
    }
    generate(length) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdId = 0;
            try {
                // Acquire a lock.
                let lock = yield this.redlock.acquire(["a"], 5000);
                let value = yield this.client.get('id');
                if (null === value) {
                    value = 0;
                }
                value++;
                yield this.client.set('id', value);
                createdId = value;
                console.log(value);
                yield lock.release();
            }
            catch (e) {
                console.error("Error when trying to set:", createdId);
            }
            const createdIdString = this.padStart(createdId, length);
            return this.prefix + createdIdString + this.checkDigit.create(createdIdString);
        });
    }
    padStart(baseNumber, length) {
        return (baseNumber.toString()).padStart(length, '0');
    }
}
exports.default = IdGenerator;
