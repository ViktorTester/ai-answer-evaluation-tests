import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { AiAnswerService } from "../../src/ai/aiAnswerService";
import { AiJudge } from "../../src/evaluation/aiJudge";

type AiPromptCase = {
    id: string;
    prompt: string;
    expectedMeaning: string;
    minScore: number;
};

function loadPromptCases(): AiPromptCase[] {
    const filePath = path.resolve(process.cwd(), "test-data/ai/qa-prompts.json");
    const rawData = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(rawData) as AiPromptCase[];
}

const testCases = loadPromptCases();

test.describe("@ai-evaluation AI answer evaluation", () => {

    for (const testCase of testCases) {
        test(`${testCase.id} - answer should match expected meaning`, async () => {
            const answerService = new AiAnswerService();
            const judge = new AiJudge();

            const actualAnswer = await answerService.getAnswer(testCase.prompt);

            expect(actualAnswer, "AI answer should not be empty").toBeTruthy();

            const evaluation = await judge.evaluate({
                userPrompt: testCase.prompt,
                actualAnswer,
                expectedMeaning: testCase.expectedMeaning,
            });

            expect(evaluation.passed, evaluation.reason).toBe(true);
            expect(evaluation.score, evaluation.reason).toBeGreaterThanOrEqual(testCase.minScore);
        });
    }
});