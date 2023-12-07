import { AxiosError } from 'axios';

export abstract class BaseError
  extends Error
  implements EnergizouRegistrations.Errors.Error
{
  cause: unknown;
  action: string;

  constructor(options: EnergizouRegistrations.Errors.ErrorOptions) {
    super(options.message);
    this.cause = options.cause;
    this.action = options.action;
  }
}

export class NotFoundError extends BaseError {
  constructor(cause?: unknown) {
    super({
      message: 'O recurso solicitado não foi encontrado.',
      action: 'Verifique a URL e tente novamente.',
      cause,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(
    cause?: unknown,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super({
      message: 'Ocorreu um erro de validação.',
      action: 'Corrija os erros e tente novamente.',
      cause,
    });
  }
}

export class ServerError extends BaseError {
  constructor(cause?: unknown) {
    super({
      message: 'Ocorreu um erro no servidor.',
      action: 'Tente novamente mais tarde.',
      cause,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(cause?: unknown) {
    super({
      message: 'Acesso negado.',
      action: 'Verifique suas credenciais e tente novamente.',
      cause,
    });
  }
}

export class SessionExpiredError extends BaseError {
  constructor(cause?: unknown) {
    super({
      message: 'Sessão expirada.',
      action: 'Verifique suas credenciais e tente novamente.',
      cause,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(cause?: unknown) {
    super({
      message: 'Acesso negado.',
      action: 'Você não tem permissão para realizar esta ação.',
      cause,
    });
  }
}

export class NetworkError extends BaseError {
  constructor(cause?: unknown) {
    super({
      message: 'Ocorreu um erro durante a comunicação com o servidor.',
      action: 'Verifique sua conexão e tente novamente.',
      cause,
    });
  }
}

export class ErrorFactory {
  static createFromAxiosError(
    axiosError: AxiosError<EnergizouRegistrations.RestAPI.ErrorResponseData>,
  ): BaseError {
    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 400:
        case 422:
          return new ValidationError(
            axiosError,
            axiosError.response.data.message as Record<string, string>,
          );
        case 401:
          return new UnauthorizedError(axiosError);
        case 403:
          return new ForbiddenError(axiosError);
        case 404:
          return new NotFoundError(axiosError);
        case 500:
          return new ServerError(axiosError);
      }
    }
    return new NetworkError(axiosError);
  }
}
