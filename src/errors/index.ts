import type { AxiosError } from 'axios';

abstract class BaseError
  extends Error
  implements EnergizouRegistrations.Errors.Error
{
  cause: unknown;
  action: string;

  constructor(
    protected readonly axiosError: AxiosError,
    options: EnergizouRegistrations.Errors.ErrorOptions,
  ) {
    super(options.message);
    this.cause = options.cause;
    this.action = options.action;
  }
}

export class ValidationError extends BaseError {
  constructor(axiosError: AxiosError) {
    super(axiosError, {
      message: 'Ocorreu um erro de validação.',
      action: 'Corrija os erros e tente novamente.',
      cause: axiosError.response?.data,
    });
  }
}

export class ServerError extends BaseError {
  constructor(axiosError: AxiosError) {
    super(axiosError, {
      message: 'Ocorreu um erro no servidor.',
      action: 'Tente novamente mais tarde.',
      cause: axiosError.response?.data,
    });
  }
}
