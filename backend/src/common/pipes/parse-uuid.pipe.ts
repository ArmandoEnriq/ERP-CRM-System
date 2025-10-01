import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidUUID } from '../../database/utils/database.utils';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('UUID es requerido');
    }

    if (!isValidUUID(value)) {
      throw new BadRequestException('UUID inválido');
    }

    return value;
  }
}
