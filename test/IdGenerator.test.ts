import {describe, expect, test} from '@jest/globals';
import IdGenerator from '../IdGenerator';
import { checkDigitType } from '../CheckDigitType';

beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(1);
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
});

afterEach(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
})

const checkDigitMock: checkDigitType = {
  isValid: () => true,
  create: () => '6',
  apply: () => '6',
}

describe('Generate Id', () => {
  test('generate with timestamp and random number', () => {
    const sut = new IdGenerator('ACME', checkDigitMock);
    expect(sut.generate(15)).toBe('ACME1577836800000996')
  });

  test('generate with timestamp only', () => {
    const sut = new IdGenerator('ACME', checkDigitMock);
    expect(sut.generate(13)).toBe('ACME15778368000006')
  });
});

