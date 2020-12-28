export class ValidationError extends TypeError {
  public constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
