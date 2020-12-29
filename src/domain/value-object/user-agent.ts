import UaParser from 'ua-parser-js';
import { ValueObject } from '~lib/domain/value-object';
import { Validate } from '~lib/validate';

export class UserAgent extends ValueObject<string> {
  public readonly browser: { name?: string; version?: string };
  public readonly device: { model?: string; type?: string; vendor?: string };
  public readonly os: { name?: string; version?: string };

  public constructor(value: string) {
    Validate.string(value).minLength(1);
    super(value);

    const uaParser = new UaParser(value);
    const parsed = uaParser.getResult();

    this.browser = {
      name: parsed.browser.name,
      version: parsed.browser.version,
    };
    this.device = {
      model: parsed.device.model,
      type: parsed.device.type,
      vendor: parsed.device.vendor,
    };
    this.os = {
      name: parsed.os.name,
      version: parsed.os.version,
    };
  }
}
