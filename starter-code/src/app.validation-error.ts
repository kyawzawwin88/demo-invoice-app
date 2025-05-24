import { BadRequestException, HttpStatus, ValidationError } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isEmail } from 'validator';

export class ValidationExceptionFactory {
  static create(errors: ValidationError[]) {
    const formatErrors = (errors: ValidationError[]): string[] => {
      return errors.reduce((messages: string[], error) => {
        if (error.constraints) {
          messages.push(...Object.values(error.constraints));
        }
        if (error.children?.length) {
          messages.push(...formatErrors(error.children));
        }
        return messages;
      }, []);
    };
    
    const errorMessage = formatErrors(errors).join('<br/>');
    return new BadRequestException({
      status_code: HttpStatus.BAD_REQUEST,
      status: errorMessage,
      time_taken_in_ms: 0,
      data: null,
    });
  }
}

export function IsEmailIfNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEmailIfNotEmpty',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined || value === '') return true;
          return isEmail(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid email`;
        },
      },
    });
  };
}
