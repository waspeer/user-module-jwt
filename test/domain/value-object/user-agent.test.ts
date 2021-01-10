import { UserAgent } from '../../../src/domain/value-object/user-agent';
import { DomainError } from '~lib/errors/domain-error';

describe('User Agent', () => {
  it('should construct when provided with a valid value', () => {
    const validValues = [
      'Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Sprint APA7373KT Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.106 Chrome/15.0.874.106 Safari/535.2',
      'Mozilla/5.0 (compatible; Konqueror/4.1; OpenBSD) KHTML/4.1.4 (like Gecko)',
      'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11',
    ];

    validValues.forEach((value) => {
      expect(() => new UserAgent(value as any)).not.toThrowError();
    });
  });

  it('should throw an error when provided with an invalid value', () => {
    const invalidValues = ['', null];

    invalidValues.forEach((value) => {
      expect(() => new UserAgent(value as any)).toThrow(DomainError);
    });
  });

  it('should provide parsed metadata', () => {
    const userAgent = new UserAgent(
      'Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Sprint APA7373KT Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0',
    );

    expect(userAgent.browser).toMatchInlineSnapshot(`
      Object {
        "name": "WebKit",
        "version": "533.1",
      }
    `);
    expect(userAgent.device).toMatchInlineSnapshot(`
      Object {
        "model": "Evo Shift 4G",
        "type": "mobile",
        "vendor": "HTC",
      }
    `);
    expect(userAgent.os).toMatchInlineSnapshot(`
      Object {
        "name": "Android",
        "version": "2.3.4",
      }
    `);
  });
});
