import { ConfigService } from '@nestjs/config';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { AnalyzeAtsDto } from './dto/analyze-ats.dto';
import { ImproveTextDto } from './dto/improve-text.dto';
export declare class AiService {
    private readonly configService;
    private readonly apiKey;
    constructor(configService: ConfigService);
    private callOpenRouter;
    generateSummary(dto: GenerateSummaryDto): Promise<{
        summary: string;
    }>;
    analyzeAts(dto: AnalyzeAtsDto): Promise<{
        score: number;
        matchedKeywords: {
            keyword: string;
            weight: string;
            foundIn: string;
        }[];
        missingKeywords: {
            keyword: string;
            weight: string;
        }[];
        vagueJDTerms: string[];
        suggestions: string[];
    }>;
    improveText(dto: ImproveTextDto): Promise<{
        improved: string;
    }>;
}
