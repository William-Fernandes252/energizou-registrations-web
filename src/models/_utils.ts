import { ErrorFactory } from '@/errors';
import { AxiosError } from 'axios';

export function handleApiCallError(error: unknown) {
  if (error instanceof AxiosError && error.response) {
    return ErrorFactory.createFromAxiosError(error);
  } else {
    return error;
  }
}
