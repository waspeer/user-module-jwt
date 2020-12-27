abstract class CustomError extends Error {
  constructor(message: string, errorClass: { new (...args: any[]): Error }) {
    super(message);
    Object.setPrototypeOf(this, errorClass.prototype);
  }
}

export { CustomError as Error };
