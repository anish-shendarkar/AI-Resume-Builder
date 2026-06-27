import { IsString, IsNotEmpty } from 'class-validator';

export class ImproveTextDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
