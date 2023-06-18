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
class IdsGenerator {
    constructor(idGenerator, idNumberLength) {
        this.idGenerator = idGenerator;
        this.idNumberLength = idNumberLength;
    }
    generate(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // @todo: ids type needs to checked.
            const idsCount = parseInt((_a = req.query.ids) !== null && _a !== void 0 ? _a : '');
            const ids = [];
            for (let i = 0; i < idsCount; i++) {
                const id = yield this.idGenerator.generate(this.idNumberLength);
                ids.push(id);
            }
            return ids;
        });
    }
}
exports.default = IdsGenerator;