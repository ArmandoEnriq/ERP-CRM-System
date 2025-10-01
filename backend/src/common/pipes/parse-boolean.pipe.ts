import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    throw new BadRequestException(
      'Valor booleano inválido. Use "true" o "false".',
    );
  }
}
