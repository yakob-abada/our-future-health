import IdGenerator from "../IdGenerator";
import IdsGenerator from "../IdsGenerator";
import { Request } from 'express';

describe('Generate Ids', () => {
    test('Generate zero result', () => {
        const stubIdGenerator = {} as IdGenerator;
        const request = {
            query: {}
        } as Request

        const sut = new IdsGenerator(stubIdGenerator, 15)
        const result = sut.generate(request)
        expect(result).toStrictEqual([]);
    });

    test('Generate two resulst', () => {
        const stubIdGenerator = {
            generate: jest.fn().mockReturnValueOnce('ACME1577836800000996').mockReturnValueOnce('ACME1577836800000997')
        } as IdGenerator;
        const request = {
            query: {ids: 2} as any
        } as Request

        const sut = new IdsGenerator(stubIdGenerator, 15)
        const result = sut.generate(request)
        expect(result).toStrictEqual([
            'ACME1577836800000996',
            'ACME1577836800000997'
        ]);
    });

  });