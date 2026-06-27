import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { AnalyzeAtsDto } from './dto/analyze-ats.dto';
import { ImproveTextDto } from './dto/improve-text.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /ai/generate-summary
   * Generates a professional resume summary using AI.
   */
  @Post('generate-summary')
  @HttpCode(HttpStatus.OK)
  generateSummary(@Body() dto: GenerateSummaryDto) {
    return this.aiService.generateSummary(dto);
  }

  /**
   * POST /ai/analyze-ats
   * Scores the resume against a job description and returns
   * matched/missing keywords, vague JD terms, and improvement suggestions.
   */
  @Post('analyze-ats')
  @HttpCode(HttpStatus.OK)
  analyzeAts(@Body() dto: AnalyzeAtsDto) {
    return this.aiService.analyzeAts(dto);
  }

  /**
   * POST /ai/improve-text
   * Rewrites resume bullet points with action verbs and quantified impact.
   */
  @Post('improve-text')
  @HttpCode(HttpStatus.OK)
  improveText(@Body() dto: ImproveTextDto) {
    return this.aiService.improveText(dto);
  }
}
