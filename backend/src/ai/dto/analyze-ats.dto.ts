import { IsString, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ResumeDataDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  github: string;

  @IsString()
  linkedin: string;

  @IsString()
  portfolio: string;

  @IsString()
  role: string;

  @IsString()
  summary: string;

  @IsString()
  skills: string;

  @IsString()
  experience: string;

  @IsString()
  projects: string;
}

export class AnalyzeAtsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ResumeDataDto)
  resumeData: ResumeDataDto;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;
}
