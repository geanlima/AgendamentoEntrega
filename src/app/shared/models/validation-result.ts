import { ValidationError } from './validation-error';

export class ValidationResult {
  errors: ValidationError[] = [];

  isValid: boolean | undefined;
}
