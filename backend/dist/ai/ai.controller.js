"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const generate_summary_dto_1 = require("./dto/generate-summary.dto");
const analyze_ats_dto_1 = require("./dto/analyze-ats.dto");
const improve_text_dto_1 = require("./dto/improve-text.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    generateSummary(dto) {
        return this.aiService.generateSummary(dto);
    }
    analyzeAts(dto) {
        return this.aiService.analyzeAts(dto);
    }
    improveText(dto) {
        return this.aiService.improveText(dto);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('generate-summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_summary_dto_1.GenerateSummaryDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateSummary", null);
__decorate([
    (0, common_1.Post)('analyze-ats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyze_ats_dto_1.AnalyzeAtsDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "analyzeAts", null);
__decorate([
    (0, common_1.Post)('improve-text'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [improve_text_dto_1.ImproveTextDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "improveText", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map