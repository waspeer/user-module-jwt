import { IpAddress } from '../../../src/domain/value-object/ip-address';
import { DomainError } from '~lib/errors/domain-error';

describe('Ip Address', () => {
  it('should construct when provided with a valid value', () => {
    const validIps = ['115.42.150.37', '192.168.0.1', '110.234.52.124'];

    validIps.forEach((ip) => {
      expect(() => new IpAddress(ip)).not.toThrowError();
    });
  });

  it('should throw an error when provided value is invalid', () => {
    const invalidIps = [
      '210.110',
      '255',
      'y.y.y.y',
      '255.0.0.y',
      '666.10.10.20',
      '4444.11.11.11',
      '33.3333.33.3',
    ];

    invalidIps.forEach((ip) => {
      expect(() => new IpAddress(ip)).toThrow(DomainError);
    });
  });
});
