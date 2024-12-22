import { ApiProperty } from '@nestjs/swagger';

export class Job {}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
