import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidUUID } from '../../database/utils/database.utils';

@Injectable()
export class ParseUserIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('User ID es requerido');
    }

    if (!isValidUUID(value)) {
      throw new BadRequestException('User ID debe ser un UUID válido');
    }

    return value;
  }
}
