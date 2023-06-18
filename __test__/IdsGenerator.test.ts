import IdGenerator from "../IdGenerator";
import IdsGenerator from "../IdsGenerator";
import { Request } from 'express';
import Redlock, { Lock } from "redlock";

describe('Generate Ids', () => {
    test('Generate zero result', async () => {
        const stubIdGenerator = {} as IdGenerator;
        const request = {
            query: {ids: 0} as any
        } as Request

        const stubClient = {} as any

        const stubLock = {
            release: jest.fn()
        } as Lock

        const stubRedLock = {
            acquire: jest.fn().mockResolvedValue(stubLock)
        } as Redlock

        const sut = new IdsGenerator(stubIdGenerator, 15, stubClient, stubRedLock)
        const result = await sut.generate(request)
        expect(result).toStrictEqual([]);
    });

    test('Generate two results', async () => {
        const stubIdGenerator = {
            generate: jest.fn().mockReturnValueOnce('ACME1577836800000996').mockReturnValueOnce('ACME1577836800000997')
        } as IdGenerator;
        const request = {
            query: {ids: 2} as any
        } as Request

        const stubClient = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn()
        } as any

        const stubLock = {
            release: jest.fn()
        } as Lock

        const stubRedLock = {
            acquire: jest.fn().mockResolvedValue(stubLock)
        } as Redlock

        const sut = new IdsGenerator(stubIdGenerator, 15, stubClient, stubRedLock)
        const result = await sut.generate(request)
        expect(result).toStrictEqual([
            'ACME1577836800000996',
            'ACME1577836800000997'
        ]);
    });
  });