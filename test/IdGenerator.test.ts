import {describe, expect, test} from '@jest/globals';
import IdGenerator from '../IdGenerator';
import { checkDigitType } from '../CheckDigitType';

const checkDigitMock: checkDigitType = {
  isValid: () => true,
  create: () => '6',
  apply: () => '6',
}

describe('Generate Id', () => {
  test('generate with fixed number', () => {
    const sut = new IdGenerator('ACME', checkDigitMock);
    expect(sut.generate(12, 9)).toBe('ACME0000000126')
  });
});

