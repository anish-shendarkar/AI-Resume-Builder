import { AiService } from './ai.service';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { AnalyzeAtsDto } from './dto/analyze-ats.dto';
import { ImproveTextDto } from './dto/improve-text.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
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
