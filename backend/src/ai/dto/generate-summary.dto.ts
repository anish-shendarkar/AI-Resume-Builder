import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateSummaryDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  skills: string;

  @IsString()
  experience: string;
}
