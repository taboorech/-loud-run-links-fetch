class CustomError extends Error {
  public statusNumber: number;

  constructor(message: string, statusNumber?: number) {
    super();
    this.message = message;
    this.statusNumber = statusNumber;
  }
};

export { CustomError };