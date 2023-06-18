"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IdGenerator_1 = __importDefault(require("./IdGenerator"));
const IdsGenerator_1 = __importDefault(require("./IdsGenerator"));
const checkdigit_1 = __importDefault(require("checkdigit"));
const redis = __importStar(require("redis"));
const redlock_1 = __importDefault(require("redlock"));
class IdGeneratorFactory {
    static create() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = (_a = process.env.ID_PREFIX) !== null && _a !== void 0 ? _a : '';
            const idLength = (_b = process.env.ID_LENGTH) !== null && _b !== void 0 ? _b : '';
            const redisClient = redis.createClient({
                url: 'redis://127.0.0.1:6379'
            });
            yield redisClient.connect();
            // Here we pass our client to redlock.
            const redlock = new redlock_1.default(
            // You should have one client for each independent  node
            // or cluster.
            [redisClient], {
                // The expected clock drift; for more details see:
                // http://redis.io/topics/distlock
                driftFactor: 0.01,
                // The max number of times Redlock will attempt to lock a resource
                // before erroring.
                retryCount: 10,
                // the time in ms between attempts
                retryDelay: 100,
                // the max time in ms randomly added to retries
                // to improve performance under high contention
                // see https://www.awsarchitectureblog.com/2015/03/backoff.html
                retryJitter: 200,
                // The minimum remaining time on a lock before an extension is automatically
                // attempted with the `using` API.
                automaticExtensionThreshold: 500, // time in ms
            });
            return new IdsGenerator_1.default(new IdGenerator_1.default(prefix, checkdigit_1.default.mod11, redisClient), parseInt(idLength), redlock);
        });
    }
}
exports.default = IdGeneratorFactory;
