/**
 * Custom exception class for Movie API exceptions.
 */

import { ExceptionName } from './custom.exception.enum';
import { ICustomExceptionInfo } from './exception-info.interface';
import { getException } from './metadata.exception';

export abstract class MovieApiException extends Error {
  public exceptionName: ExceptionName;
  public exceptionInfo: ICustomExceptionInfo;

  constructor(exceptionName: ExceptionName, message: string) {
    super();
    this.exceptionName = exceptionName;
    this.exceptionInfo = getException(exceptionName);
    this.exceptionInfo.detail = message;
  }

  public toString = (): string => {
    return `${this.exceptionName} exception:\n${this.exceptionInfo}`;
  };
}

export class MovieApiNotFoundException extends MovieApiException {
  constructor(message: string) {
    super(ExceptionName.NOT_FOUND, message);
  }
}

export class MovieApiConflictException extends MovieApiException {
  constructor(message: string) {
    super(ExceptionName.CONFLICT, message);
  }
}

export class MovieApiValidationException extends MovieApiException {
  constructor(message: string) {
    super(ExceptionName.VALIDATION_FAILED, message);
  }
}

export class MovieApiInternalException extends MovieApiException {
  constructor(message: string) {
    super(ExceptionName.INTERNAL_EXCEPTION, message);
  }
}
